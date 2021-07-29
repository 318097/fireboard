import colors, { Button, ConfirmBox, Icon, Tag } from "@codedrops/react-ui";
import markdown from "markdown-it";
import moment from "moment";
import classnames from "classnames";
import React, { Fragment, useState } from "react";
import { formatDate } from "@codedrops/lib";

const md = markdown({
  breaks: true,
});

const getDeadlineStatus = ({ deadline, status } = {}) => {
  if (!deadline) return null;

  deadline = moment(deadline);
  const now = moment();
  let deadlineStatus = "";

  const isExpired = now.isAfter(deadline, "day");

  return isExpired ? `Due ${deadline.from(now)}` : `Due ${now.from(deadline)}`;
};

const Todo = ({
  todo: { content, _id, marked, createdAt, status },
  editTodo,
  index,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
  itemVisibilityStatus,
  updateItemStatus,
}) => {
  const { completedOn, deadline } = status || {};
  const [expanded, setExpanded] = useState(itemVisibilityStatus[_id] ?? true);

  const toggleTodo = () =>
    setExpanded((prev) => {
      const newValue = !prev;
      updateItemStatus({ [_id]: newValue });
      return newValue;
    });

  const itemClassnames = classnames("item", {
    highlight: editTodo && editTodo._id === _id,
    marked: marked && mode === "ADD",
  });

  const contentClassnames = classnames("content", {
    "single-line": !expanded,
  });

  const deadlineStatus = getDeadlineStatus({ deadline });
  return (
    <div key={_id} className={itemClassnames}>
      <div className="content-wrapper">
        <div className="content-index">{`${index + 1}. `}</div>
        <div className="content-data" style={{ overflow: "hidden" }}>
          <div
            className={contentClassnames}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
          {expanded && (
            <div className="item-meta">
              <span>Created:</span>
              <span>{formatDate(createdAt)}</span>
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
              {mode === "ADD" && (
                <div className="flex center gap-4">
                  <Button
                    className="ui-button action-buttons"
                    skipDefaultClass={true}
                    size="sm"
                    onClick={() => setTodoToEdit(_id)}
                    type="link"
                  >
                    Edit
                  </Button>
                  {/* <ConfirmBox onConfirm={() => deleteTodo(_id)}> */}
                  <Button
                    className="ui-button action-buttons"
                    skipDefaultClass={true}
                    size="sm"
                    type="link"
                  >
                    Delete
                  </Button>
                  {/* </ConfirmBox> */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {editTodo && editTodo._id === _id ? (
        <Button
          className="ui-button"
          skipDefaultClass={true}
          size="sm"
          onClick={clearTodo}
        >
          Cancel
        </Button>
      ) : (
        <div className="actions">
          {!marked && (
            <Icon size={10} type="check" onClick={() => markTodo(_id)} />
          )}
          <Icon
            fill={colors.iron}
            size={10}
            type="caret"
            direction={expanded ? "up" : "down"}
            onClick={toggleTodo}
          />
        </div>
      )}
    </div>
  );
};

export default Todo;
