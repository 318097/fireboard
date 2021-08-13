import axios from "axios";
import React from "react";
import "./Todos.scss";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData } from "../../lib/helpers";
import { constants } from "../../state";
import AddItem from "./AddItem";
import Todo from "./Todo";
import handleError from "../../lib/errorHandling";
import notify from "../../lib/notify";
import _ from "lodash";
import { Collapse, Empty, Menu, Dropdown, Tag } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import tracker from "../../lib/mixpanel";

const { Panel } = Collapse;

const Todos = ({ state, dispatch, mode, setAppLoading, updateItemStatus }) => {
  const {
    todos,
    topics,
    selectedTask,
    pendingTasksOnly,
    itemVisibilityStatus,
  } = state;

  const setTaskToEdit = (_id, type) => {
    dispatch({
      type: constants.SET_TASK_FOR_EDIT,
      payload: {
        _id,
        type,
        mode: "EDIT",
      },
    });
  };

  const clear = () => dispatch({ type: constants.CLEAR });

  const updateTask = async (id, update, type) => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/tasks/${id}`, update);
    dispatch({ type: constants.UPDATE_TASK, payload: result });

    notify(`${type === "TODO" ? "Todo" : "Topic"} updated`);
    setAppLoading(false);
  };

  const deleteTask = async (_id, type) => {
    try {
      setAppLoading(true);
      await axios.delete(`/dot/tasks/${_id}`);
      dispatch({ type: constants.DELETE_TASK, payload: { _id, type } });
      notify("Deleted");
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const markTodo = async (_id, marked) => {
    setAppLoading(true);
    try {
      const {
        data: { result },
      } = await axios.put(`/dot/tasks/${_id}/stamp`, { marked });
      dispatch({ type: constants.MARK_TODO, payload: result });
      notify("Marked as done");
      tracker.track("MARK_AS_DONE");
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const data = formatData({
    todos,
    topics,
    today: mode === "VIEW",
    pendingTasksOnly,
  });

  const updateVisibilityStatus = (updates) => {
    updateItemStatus(updates);
  };

  return (
    <section>
      <BlockerScreen state={state} />
      {data.length ? (
        <div className="list-container">
          <Collapse
            bordered={false}
            defaultActiveKey={itemVisibilityStatus}
            onChange={updateVisibilityStatus}
            // expandIconPosition={"right"}
          >
            {data.map((topic) => {
              const {
                todos = [],
                _id,
                doneCount,
                content,
                status,
              } = topic || {};

              const extra = [
                <DropdownMenu
                  key="dropdown-menu"
                  updateTask={updateTask}
                  setTaskToEdit={setTaskToEdit}
                  deleteTask={deleteTask}
                  _id={_id}
                  status={status}
                />,
              ];

              if (todos.length)
                extra.unshift(
                  <Tag key="done-stat" size="small">
                    {pendingTasksOnly
                      ? `${todos.length} pending`
                      : `${doneCount}/${todos.length} completed`}
                  </Tag>
                );

              return (
                <Panel
                  size="small"
                  header={
                    <div>
                      <span className="topic-name">{content}</span>
                      {status?.startedOn && (
                        <span className="topic-name">
                          Started: {status.startedOn}
                        </span>
                      )}
                      {status?.stoppedOn && (
                        <span className="topic-name">
                          Stopped: {status.stoppedOn}
                        </span>
                      )}
                    </div>
                  }
                  key={_id}
                  extra={extra}
                >
                  {mode === "VIEW" && !todos.length ? null : !todos.length ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <div className="topic-content gap">
                      {todos.map((todo, index) => (
                        <Todo
                          todo={todo}
                          key={todo._id}
                          selectedTask={selectedTask}
                          index={index}
                          setTaskToEdit={setTaskToEdit}
                          clear={clear}
                          deleteTask={deleteTask}
                          markTodo={markTodo}
                          mode={mode}
                          updateItemStatus={updateItemStatus}
                        />
                      ))}
                    </div>
                  )}
                </Panel>
              );
            })}
          </Collapse>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      {mode === "ADD" && (
        <AddItem
          state={state}
          dispatch={dispatch}
          setAppLoading={setAppLoading}
          updateTask={updateTask}
        />
      )}
    </section>
  );
};

const DropdownMenu = ({
  updateTask,
  setTaskToEdit,
  deleteTask,
  _id,
  status,
}) => {
  const handleClick = (e) => {
    switch (e.key) {
      case "start":
        return updateTask(_id, { start: true }, "TOPIC");
      case "stop":
        return updateTask(_id, { stop: true }, "TOPIC");
      case "edit":
        return setTaskToEdit(_id, "TOPIC");
      case "delete":
        return deleteTask(_id, "TOPIC");
      case "hide":
        return updateTask(_id, { visible: false }, "TOPIC");
    }
  };

  const menu = (
    <Menu onClick={handleClick}>
      {status?.startedOn ? (
        <Menu.Item key="stop">Stop</Menu.Item>
      ) : (
        <Menu.Item key="start">Start</Menu.Item>
      )}
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="delete">Delete </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="hide">Hide</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <SettingOutlined
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </Dropdown>
  );
};

export default Todos;
