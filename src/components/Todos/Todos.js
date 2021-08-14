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
import { Menu, MenuItem, Badge } from "@mantine/core";
import tracker from "../../lib/mixpanel";

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
          {data.map((topic) => {
            const { todos = [], _id, doneCount, content, status } = topic || {};

            return (
              <div className="topic-container" key={_id}>
                <div className="topic-header">
                  <div className="left-container">
                    <div className="topic-name">{content}</div>
                    {/* {status?.startedOn && (
                      <span className="topic">Started: {status.startedOn}</span>
                    )}
                    {status?.stoppedOn && (
                      <span className="topic">Stopped: {status.stoppedOn}</span>
                    )} */}
                  </div>
                  <div className="actions">
                    {!!todos.length && (
                      <Badge
                        key="done-stat"
                        size="xs"
                        radius="xs"
                        color="green"
                      >
                        {pendingTasksOnly
                          ? `${todos.length} pending`
                          : `${doneCount}/${todos.length} completed`}
                      </Badge>
                    )}
                    <DropdownMenu
                      key="dropdown-menu"
                      updateTask={updateTask}
                      setTaskToEdit={setTaskToEdit}
                      deleteTask={deleteTask}
                      _id={_id}
                      status={status}
                    />
                  </div>
                </div>

                {mode === "VIEW" && !todos.length ? null : !todos.length ? (
                  <div className="empty-message">Empty</div>
                ) : (
                  <div className="topic-body">
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-message">Empty</div>
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

  const menu = [
    { id: "start", label: "Start", visible: true },
    { id: "stop", label: "Stop", visible: status?.startedOn },
    { id: "edit", label: "Edit", visible: true },
    { id: "delete", label: "Delete", visible: true },
    { id: "hide", label: "Hide", visible: true },
  ];

  return (
    <Menu
      closeOnScroll={false}
      radius="xs"
      shadow="xs"
      size="xs"
      padding="xs"
      menuPosition={{ top: "100%", right: "4px" }}
    >
      {_.map(_.filter(menu, { visible: true }), ({ id, label }) => (
        <MenuItem key={id} onClick={() => handleClick(id)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Todos;
