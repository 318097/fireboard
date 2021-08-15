import {
  Button,
  Card,
  Menu,
  MenuItem,
  Divider,
  ActionIcon,
} from "@mantine/core";
import markdown from "markdown-it";
import dayjs from "dayjs";
import classnames from "classnames";
import React, { Fragment } from "react";
import { formatDate } from "@codedrops/lib";
import _ from "lodash";
import { FiCheck, FiEdit, FiTrash2, FiX } from "react-icons/fi";

const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const md = markdown({
  breaks: true,
});

const getDeadlineStatus = ({ deadline, marked } = {}) => {
  if (!deadline) return null;

  deadline = dayjs(deadline);

  if (marked) return { date: `Deadline: ${formatDate(deadline)}` };

  const now = dayjs();

  const remainingTime = deadline.from(now);
  const isExpired = now.isAfter(deadline, "day");

  const status = isExpired ? "EXPIRED" : "PENDING";
  const date = isExpired
    ? `Expired ${remainingTime}`
    : `Expires ${remainingTime}`;

  return { status, date };
};

const DropdownMenu = ({ markTodo, setTaskToEdit, deleteTask, _id, marked }) => {
  const handleClick = (key) => {
    switch (key) {
      case "edit":
        return setTaskToEdit(_id, "TODO");
      case "delete":
        return deleteTask(_id, "TODO");
      case "unmark":
        return markTodo(_id, false);
    }
  };

  const menu = [
    { id: "edit", label: "Edit", visible: true, icon: <FiEdit /> },
    { id: "delete", label: "Delete", visible: true, icon: <FiTrash2 /> },
    { id: "unmark", label: "Unmark", visible: marked, icon: <FiX /> },
  ];

  return (
    <Menu
      closeOnScroll={false}
      radius="xs"
      shadow="xs"
      size="xs"
      padding="xs"
      menuPosition={{ bottom: "100%", right: "4px" }}
    >
      {_.map(_.filter(menu, { visible: true }), ({ id, label, icon }) => (
        <MenuItem key={id} icon={icon} onClick={() => handleClick(id)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

const Todo = ({
  todo: { content, _id, marked, createdAt, status },
  selectedTask,
  setTaskToEdit,
  clear,
  deleteTask,
  markTodo,
  mode,
}) => {
  const { completedOn, deadline } = status || {};

  const deadlineObj = getDeadlineStatus({ deadline, marked });
  const isCreatedToday = dayjs().isSame(dayjs(createdAt), "day");

  const itemClassnames = classnames("item", {
    highlight: selectedTask && selectedTask._id === _id,
    marked: marked && mode === "ADD",
    expired: deadlineObj?.status === "EXPIRED",
    ["in-progress"]: deadlineObj?.status === "PENDING",
  });

  const isEditMode = Boolean(selectedTask?._id === _id);

  return (
    <Card
      radius="xs"
      shadow="xs"
      padding="xs"
      key={_id}
      className={itemClassnames}
    >
      <div className="content-wrapper">
        <div className="content-data">
          <div
            className={"content"}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
        </div>
      </div>
      <Divider className="mt-4 mb-4" variant="dashed" />
      <div className="footer">
        <div className="meta-info">
          <span>Created:</span>
          <span>{isCreatedToday ? "Today" : formatDate(createdAt)}</span>
          {marked && (
            <Fragment>
              <span className="ml-4 mr-4">&#8226;</span>
              <span>Completed:</span>
              <span>{formatDate(completedOn)}</span>
            </Fragment>
          )}
          {deadline && (
            <Fragment>
              <span className="ml-4 mr-4">&#8226;</span>
              <span>Deadline:</span>
              <span>{formatDate(deadline)}</span>
              <span className="ml-4 mr-4">&#8226;</span>
              <span>{deadlineObj.date}</span>
            </Fragment>
          )}
        </div>
        <div className="actions">
          {isEditMode ? (
            <Button size="xs" radius="xs" variant="link" onClick={clear}>
              Cancel
            </Button>
          ) : (
            <Fragment>
              <ActionIcon onClick={() => markTodo(_id, true)}>
                <FiCheck key="check-icon" />
              </ActionIcon>
              <DropdownMenu
                key="more-options"
                markTodo={markTodo}
                setTaskToEdit={setTaskToEdit}
                deleteTask={deleteTask}
                _id={_id}
                marked={marked}
              />
            </Fragment>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Todo;
