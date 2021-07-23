import colors, { Button, ConfirmBox, Icon, Tag } from "@codedrops/react-ui";
import markdown from "markdown-it";
import moment from "moment";
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
}) => {
  const { completedOn, deadline } = status || {};
  const [showContent, setShowContent] = useState(true);

  const className = `item${
    editTodo && editTodo._id === _id ? " highlight" : ""
  }${marked && mode === "ADD" ? " marked" : ""}`;

  const deadlineStatus = getDeadlineStatus({ deadline });
  return (
    <div key={_id} className={className}>
      <div className="content-wrapper">
        <div className="content-index">{`${index + 1}. `}</div>
        <div className="content-data" style={{ overflow: "hidden" }}>
          <div
            className={`content ${showContent ? "" : "single-line"}`}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
          {showContent && (
            <div className="item-meta">
              <span>Created:</span>
              <span>{formatDate(createdAt)}</span>
              {marked && (
                <Fragment>
                  <span className="ml mr">&#8226;</span>
                  <span>Completed:</span>
                  <span>{formatDate(completedOn)}</span>
                </Fragment>
              )}
              {deadline && (
                <Fragment>
                  <span className="ml mr">&#8226;</span>
                  <span>{deadlineStatus}</span>
                </Fragment>
              )}
              <div className="flex center mt gap-4">
                <Button
                  className="ui-button"
                  skipDefaultClass={true}
                  size="sm"
                  onClick={() => setTodoToEdit(_id)}
                >
                  Edit
                </Button>
                {/* <ConfirmBox onConfirm={() => deleteTodo(_id)}> */}
                <Button className="ui-button" skipDefaultClass={true} size="sm">
                  Delete
                </Button>
                {/* </ConfirmBox> */}
              </div>
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
            <Icon size={12} type="check" onClick={() => markTodo(_id)} />
          )}
          <Icon
            fill={colors.iron}
            size={12}
            type="caret"
            direction={showContent ? "up" : "down"}
            onClick={() => setShowContent((prev) => !prev)}
          />
        </div>
      )}
    </div>
  );
};

export default Todo;
