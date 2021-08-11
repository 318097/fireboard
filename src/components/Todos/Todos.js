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

  const setTaskToEdit = (_id) => {
    dispatch({
      type: constants.SET_EDIT_TODO,
      payload: {
        _id,
        mode: "EDIT",
      },
    });
  };

  const clear = () => dispatch({ type: constants.CLEAR });

  const updateTask = async (id, update) => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/tasks/${id}`, update);
    dispatch({ type: constants.UPDATE_TASK, payload: result });

    notify("Todo updated");
    setAppLoading(false);
  };

  const deleteTask = async (_id) => {
    try {
      setAppLoading(true);
      await axios.delete(`/dot/tasks/${_id}`);
      dispatch({ type: constants.DELETE_TASK, payload: _id });
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

  const DropdownMenu = ({ markTodo, setTaskToEdit, deleteTask, _id }) => {
    const handleClick = (e) => {
      switch (e.key) {
        case "edit":
          return setTaskToEdit(_id);
        case "delete":
          return deleteTask(_id);
        case "hide":
          return markTodo(_id, false);
      }
    };

    const menu = (
      <Menu onClick={handleClick}>
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

  const updateVisibilityStatus = (updates) => {
    updateItemStatus(updates);
  };

  return (
    <section>
      <BlockerScreen state={state} />
      {data.length ? (
        <div className="list-container">
          <Collapse
            defaultActiveKey={itemVisibilityStatus}
            onChange={updateVisibilityStatus}
            // expandIconPosition={"right"}
          >
            {data.map((topic) => {
              const { todos = [], _id, doneCount, content } = topic || {};

              const extra = [<DropdownMenu key="dropdown-menu" />];

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
                  header={<span className="topic-name">{content}</span>}
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

export default Todos;
