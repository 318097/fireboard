import { Icon } from "@codedrops/react-ui";
import { Button, Card, Menu, MenuItem, Divider } from "@mantine/core";
import markdown from "markdown-it";
import moment from "moment";
import classnames from "classnames";
import React, { Fragment } from "react";
import { formatDate } from "@codedrops/lib";
import _ from "lodash";

const md = markdown({
  breaks: true,
});

const getDeadlineStatus = ({ deadline, marked } = {}) => {
  if (!deadline) return null;

  deadline = moment(deadline);

  if (marked) return { date: `Deadline: ${formatDate(deadline)}` };
  const now = moment();

  const remainingTime = deadline ? moment(deadline).from(now) : "";
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
    { id: "edit", label: "Edit", visible: true },
    { id: "delete", label: "Delete", visible: true },
    { id: "unmark", label: "Unmark", visible: marked },
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
      {_.map(_.filter(menu, { visible: true }), ({ id, label }) => (
        <MenuItem key={id} onClick={() => handleClick(id)}>
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
  const isCreatedToday = moment().isSame(moment(createdAt), "day");

  const itemClassnames = classnames("item", {
    highlight: selectedTask && selectedTask._id === _id,
    marked: marked && mode === "ADD",
    expired: deadlineObj?.status === "EXPIRED",
    ["in-progress"]: deadlineObj?.status === "PENDING",
  });

  const extra = [
    <DropdownMenu
      key="more-options"
      markTodo={markTodo}
      setTaskToEdit={setTaskToEdit}
      deleteTask={deleteTask}
      _id={_id}
      marked={marked}
    />,
  ];

  if (!marked)
    extra.unshift(
      <Icon
        size={10}
        type="check"
        className={"mr"}
        onClick={() => markTodo(_id, true)}
        key="check-icon"
      />
    );

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
      {Boolean(selectedTask?._id === _id) && (
        <Button size="small" onClick={clear}>
          Cancel
        </Button>
      )}
      <Divider className="mt mb" variant="dashed" />
      <div className="footer">
        <div className="meta-info">
          <span>Created:</span>
          <span>{isCreatedToday ? "Today" : formatDate(createdAt)}</span>
          {deadline && (
            <Fragment>
              <span className="ml-4 mr-4">&#8226;</span>
              <span>Deadline:</span>
              <span>{formatDate(deadline)}</span>
            </Fragment>
          )}
          {marked && (
            <Fragment>
              <span className="ml-4 mr-4">&#8226;</span>
              <span>Completed:</span>
              <span>{formatDate(completedOn)}</span>
            </Fragment>
          )}

          {/* {deadline && <span>{deadlineObj?.date}</span>} */}
        </div>
        <div className="actions">{extra}</div>
      </div>
    </Card>
  );
};

export default Todo;
