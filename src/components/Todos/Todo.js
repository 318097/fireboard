import { Icon } from "@codedrops/react-ui";
import { Button, Card, Menu, Dropdown } from "antd";
import markdown from "markdown-it";
import moment from "moment";
import classnames from "classnames";
import React, { Fragment } from "react";
import { formatDate } from "@codedrops/lib";
import { MoreOutlined } from "@ant-design/icons";

const md = markdown({
  breaks: true,
});

const getDeadlineStatus = ({ deadline, marked } = {}) => {
  if (!deadline) return null;

  deadline = moment(deadline);

  if (marked) return `Deadline: ${formatDate(deadline)}`;
  const now = moment();

  const remainingTime = deadline ? moment(deadline).from(now) : "";
  const isExpired = now.isAfter(deadline, "day");

  return isExpired ? `Expired ${remainingTime}` : `Expires ${remainingTime}`;
};

const DropdownOptions = ({ markTodo, setTodoToEdit, deleteTodo, _id }) => {
  const handleClick = (e) => {
    switch (e.key) {
      case "edit":
        return setTodoToEdit(_id);
      case "delete":
        return deleteTodo(_id);
      case "unmark":
        return markTodo(_id);
    }
  };

  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="delete">Delete </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="Unmark">Unmark</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <MoreOutlined />
    </Dropdown>
  );
};

const Todo = ({
  todo: { content, _id, marked, createdAt, status },
  editTodo,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
}) => {
  const { completedOn, deadline } = status || {};

  const itemClassnames = classnames("item", {
    highlight: editTodo && editTodo._id === _id,
    marked: marked && mode === "ADD",
  });

  const deadlineStatus = getDeadlineStatus({ deadline, marked });
  const isCreatedToday = moment().isSame(moment(createdAt), "day");

  return (
    <Card
      size="small"
      key={_id}
      title={_id}
      // className={itemClassnames}
      extra={[
        <Icon
          size={10}
          type="check"
          className={"mr"}
          onClick={() => markTodo(_id)}
          key="check-icon"
        />,
        <DropdownOptions
          key="more-options"
          markTodo={markTodo}
          setTodoToEdit={setTodoToEdit}
          deleteTodo={deleteTodo}
          _id={_id}
        />,
      ]}
    >
      <div className="content-wrapper">
        <div className="content-data">
          <div
            className={"content"}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
          <div className="item-meta">
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
            {deadline && (
              <Fragment>
                <span className="ml-4 mr-4">&#8226;</span>
                <span>{deadlineStatus}</span>
              </Fragment>
            )}
            {/* {mode === "ADD" && (
              <div className="flex center gap-4">
                <Button
                  className="action-buttons"
                  size="small"
                  onClick={() => setTodoToEdit(_id)}
                  type="link"
                >
                  Edit
                </Button>
                <Button className="action-buttons" size="small" type="link">
                  Delete
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
      {Boolean(editTodo && editTodo._id === _id) && (
        <Button size="small" onClick={clearTodo}>
          Cancel
        </Button>
      )}
    </Card>
  );
};

export default Todo;
