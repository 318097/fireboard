import axios from "axios";
import React from "react";
import "./Todos.scss";
import { formatDate } from "@codedrops/lib";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData } from "../../lib/helpers";
import { constants } from "../../state";
import AddItem from "./AddItem";
import Todo from "./Todo";
import handleError from "../../lib/errorHandling";
import notify from "../../lib/notify";
import _ from "lodash";
import { Menu, MenuItem, Badge, Divider, ActionIcon } from "@mantine/core";
import tracker from "../../lib/mixpanel";
import {
  FiPlay,
  FiStopCircle,
  FiEdit,
  FiTrash2,
  FiEyeOff,
  FiChevronRight,
  FiChevronDown,
  FiMoreVertical,
} from "react-icons/fi";

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
      notify(marked ? "Marked as done" : "Marked as undone");
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

  const updateVisibilityStatus = (_id) => {
    updateItemStatus(
      _.includes(itemVisibilityStatus, _id)
        ? _.filter(itemVisibilityStatus, _id)
        : [...itemVisibilityStatus, _id]
    );
  };

  return (
    <section>
      <BlockerScreen state={state} />
      {data.length ? (
        <div className="list-container">
          {data.map((topic) => {
            const {
              todos = [],
              _id,
              doneCount,
              content,
              status,
              isDefault,
            } = topic || {};

            const isExpanded =
              mode === "VIEW" ? true : _.includes(itemVisibilityStatus, _id);
            const allTodosCompleted = doneCount === todos.length;

            return (
              <div className="topic-container" key={_id}>
                <div className="topic-header">
                  <div className="row">
                    <div className="topic-name">{content}</div>
                    {mode === "ADD" && (
                      <div className="group">
                        {!isDefault && (
                          <DropdownMenu
                            key="dropdown-menu"
                            updateTask={updateTask}
                            setTaskToEdit={setTaskToEdit}
                            deleteTask={deleteTask}
                            _id={_id}
                            status={status}
                          />
                        )}
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => updateVisibilityStatus(_id)}
                        >
                          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                        </ActionIcon>
                      </div>
                    )}
                  </div>

                  <div className="meta">
                    {!!todos.length && (
                      <Badge
                        size="xs"
                        radius="xs"
                        color={allTodosCompleted ? "cyan" : "red"}
                        className="badge"
                      >
                        {pendingTasksOnly
                          ? `${todos.length} pending`
                          : `${doneCount}/${todos.length} completed`}
                      </Badge>
                    )}
                    {status?.startedOn && (
                      <Badge
                        size="xs"
                        radius="xs"
                        className="badge"
                        color="orange"
                      >
                        Started: {formatDate(status.startedOn)}
                      </Badge>
                    )}
                    {status?.stoppedOn && (
                      <Badge
                        size="xs"
                        radius="xs"
                        className="badge"
                        color="orange"
                      >
                        Stopped: {formatDate(status.stoppedOn)}
                      </Badge>
                    )}
                  </div>
                </div>
                {/* mode === "VIEW" && !todos.length ? null : */}
                {isExpanded && (
                  <div className="topic-body">
                    <Divider variant="dashed" />
                    {!todos.length ? (
                      <div className="empty-message">Empty</div>
                    ) : (
                      todos.map((todo, index) => (
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
                      ))
                    )}
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
  const handleClick = (key) => {
    switch (key) {
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
    {
      id: "start",
      label: "Start",
      visible: !status?.startedOn,
      icon: <FiPlay />,
    },
    {
      id: "stop",
      label: "Stop",
      visible: !!status?.startedOn && !status?.stoppedOn,
      icon: <FiStopCircle />,
    },
    { id: "edit", label: "Edit", visible: true, icon: <FiEdit /> },
    { id: "delete", label: "Delete", visible: true, icon: <FiTrash2 /> },
    { id: "hide", label: "Hide", visible: true, icon: <FiEyeOff /> },
  ];

  return (
    <Menu
      closeOnScroll={false}
      radius="xs"
      shadow="xs"
      size="xs"
      padding="xs"
      menuPosition={{ top: "100%", right: "4px" }}
      control={
        <ActionIcon size="xs" variant="light">
          <FiMoreVertical />
        </ActionIcon>
      }
    >
      {_.map(_.filter(menu, { visible: true }), ({ id, label, icon }) => (
        <MenuItem icon={icon} key={id} onClick={() => handleClick(id)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default Todos;
