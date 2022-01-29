import React, { Fragment } from "react";
import "./Topics.scss";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData, formatDate } from "../../lib/helpers";
import AddItem from "../AddItem";
import Todo from "../Todo";
import _ from "lodash";
import { Menu, MenuItem, Badge, Divider, ActionIcon } from "@mantine/core";
import {
  FiPlay,
  FiStopCircle,
  FiEdit,
  FiTrash2,
  FiEyeOff,
  FiChevronRight,
  FiChevronDown,
  FiMoreVertical,
  FiPlus,
} from "react-icons/fi";
import { connect } from "react-redux";
import {
  setTaskToEdit,
  cancelSelection,
  updateTask,
  setTaskToDelete,
  markTodo,
  updateItemStatus,
  deleteTask,
  toggleAddItem,
} from "../../redux/actions";
import { mantineDefaultProps } from "../../appConstants";
import Modal from "../../lib/Modal";
import tracker from "../../lib/mixpanel";
import classnames from "classnames";

const Topics = ({
  todos,
  topics,
  selectedTask,
  pendingTasksOnly,
  itemVisibilityStatus = [],
  mode,
  updateItemStatus,
  setTaskToEdit,
  cancelSelection,
  updateTask,
  setTaskToDelete,
  markTodo,
  deleteTask,
  addItemVisibilityStatus,
  toggleAddItem,
}) => {
  const data = formatData({
    todos,
    topics,
    today: mode === "VIEW",
    pendingTasksOnly,
  });

  const updateVisibilityStatus = (_id) =>
    updateItemStatus(
      _.includes(itemVisibilityStatus, _id)
        ? _.filter(itemVisibilityStatus, (v) => v !== _id)
        : [...itemVisibilityStatus, _id]
    );

  return (
    <section id="topics">
      <BlockerScreen />
      <div className="list-container">
        {data.length ? (
          <>
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

              const metaInfoList = _.filter(
                [
                  {
                    color: allTodosCompleted ? "teal" : "red",
                    label: "pendingTasks",
                    visible: !!todos.length,
                    value:
                      pendingTasksOnly && mode === "ADD"
                        ? `${todos.length} pending`
                        : `${doneCount}/${todos.length} completed`,
                  },
                  {
                    color: "orange",
                    label: "startedOn",
                    visible: Boolean(status?.startedOn),
                    value: `Started: ${formatDate(status?.startedOn)}`,
                  },
                  {
                    color: "orange",
                    label: "endedOn",
                    visible: Boolean(status?.stoppedOn),
                    value: `Stopped: ${formatDate(status?.stoppedOn)}`,
                  },
                ],
                { visible: true }
              );
              const isEditMode = Boolean(
                selectedTask?.mode === "EDIT" && selectedTask?._id === _id
              );
              const topicContainerClasses = classnames("topic-container", {
                highlight: isEditMode,
              });
              return (
                <div className={topicContainerClasses} key={_id}>
                  <div className="topic-header">
                    <div className="row">
                      <div className="topic-name">{content}</div>
                      {mode === "ADD" && !isEditMode && (
                        <div className="group">
                          {!isDefault && (
                            <DropdownMenu
                              key="dropdown-menu"
                              updateTask={updateTask}
                              setTaskToEdit={setTaskToEdit}
                              setTaskToDelete={setTaskToDelete}
                              _id={_id}
                              status={status}
                            />
                          )}
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => updateVisibilityStatus(_id)}
                          >
                            {isExpanded ? (
                              <FiChevronDown />
                            ) : (
                              <FiChevronRight />
                            )}
                          </ActionIcon>
                        </div>
                      )}
                    </div>

                    <div className="meta">
                      {metaInfoList.map(({ label, value, color }) => (
                        <Badge
                          {...mantineDefaultProps}
                          key={label}
                          className="badge"
                          color={color}
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="topic-body">
                      <Divider variant="dashed" />
                      {!todos.length ? (
                        <div className="empty-message">Empty</div>
                      ) : (
                        todos.map((todo) => (
                          <Todo
                            todo={todo}
                            key={todo._id}
                            selectedTask={selectedTask}
                            setTaskToEdit={setTaskToEdit}
                            setTaskToDelete={setTaskToDelete}
                            markTodo={markTodo}
                            mode={mode}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="empty-message">Empty</div>
        )}
      </div>

      {mode === "ADD" && (
        <Fragment>
          {addItemVisibilityStatus ? (
            <AddItem toggleAddItem={toggleAddItem} />
          ) : (
            <ActionIcon
              {...mantineDefaultProps}
              variant="light"
              size="md"
              color="green"
              className="add-icon"
              onClick={toggleAddItem}
            >
              <FiPlus />
            </ActionIcon>
          )}
          <Modal
            visible={selectedTask?.mode === "DELETE"}
            title={`Delete ${selectedTask?.type === "TODO" ? "todo" : "topic"}`}
            content={`Are you sure you want to delete '${selectedTask?.content}'?`}
            onCancel={cancelSelection}
            onConfirm={() => {
              deleteTask(selectedTask?._id, selectedTask?.type);
              cancelSelection();
              tracker.track("DELETE_TASK", {
                type: _.toLower(selectedTask?.type),
              });
            }}
          />
        </Fragment>
      )}
    </section>
  );
};

const DropdownMenu = ({
  updateTask,
  setTaskToEdit,
  setTaskToDelete,
  _id,
  status,
}) => {
  const handleClick = (key) => {
    tracker.track("ACTION", { command: key, type: "topic" });
    switch (key) {
      case "start":
        return updateTask(_id, { start: true }, "TOPIC");
      case "stop":
        return updateTask(_id, { stop: true }, "TOPIC");
      case "edit":
        return setTaskToEdit(_id, "TOPIC");
      case "delete":
        return setTaskToDelete(_id, "TOPIC");
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
      {...mantineDefaultProps}
      closeOnScroll={false}
      placement="end"
      control={
        <ActionIcon size="sm" variant="light">
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

const mapStateToProps = ({
  todos,
  topics,
  selectedTask,
  pendingTasksOnly,
  itemVisibilityStatus,
  addItemVisibilityStatus,
}) => ({
  todos,
  topics,
  selectedTask,
  pendingTasksOnly,
  itemVisibilityStatus,
  addItemVisibilityStatus,
});

const mapDispatchToProps = {
  setTaskToEdit,
  cancelSelection,
  updateTask,
  setTaskToDelete,
  markTodo,
  updateItemStatus,
  deleteTask,
  toggleAddItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);
