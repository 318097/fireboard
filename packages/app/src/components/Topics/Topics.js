import React from "react";
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
} from "react-icons/fi";
import { connect } from "react-redux";
import {
  setTaskToEdit,
  clear,
  updateTask,
  deleteTask,
  markTodo,
  updateItemStatus,
} from "../../redux/actions";
import { mantineDefaultProps } from "../../appConstants";

const Topics = ({
  todos,
  topics,
  selectedTask,
  pendingTasksOnly,
  itemVisibilityStatus = [],
  mode,
  updateItemStatus,
  setTaskToEdit,
  clear,
  updateTask,
  deleteTask,
  markTodo,
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
        ? _.filter(itemVisibilityStatus, _id)
        : [...itemVisibilityStatus, _id]
    );

  return (
    <section>
      <BlockerScreen />
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

            const metaInfoList = _.filter(
              [
                {
                  color: allTodosCompleted ? "cyan" : "red",
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
                          clear={clear}
                          deleteTask={deleteTask}
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
        </div>
      ) : (
        <div className="empty-message">Empty</div>
      )}

      {mode === "ADD" && <AddItem />}
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
      {...mantineDefaultProps}
      closeOnScroll={false}
      menuPosition={{ top: "100%", right: "4px" }}
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
}) => ({
  todos,
  topics,
  selectedTask,
  pendingTasksOnly,
  itemVisibilityStatus,
});

const mapDispatchToProps = {
  setTaskToEdit,
  clear,
  updateTask,
  deleteTask,
  markTodo,
  updateItemStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Topics);