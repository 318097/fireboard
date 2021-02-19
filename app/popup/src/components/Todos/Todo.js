import React, { Fragment, useState } from "react";
import colors, { Icon, Button, ConfirmBox } from "@codedrops/react-ui";
import markdown from "markdown-it";
import { formatDate } from "../../helpers";

const md = markdown({
  breaks: true,
});

const Todo = ({
  todo: { content, _id, marked, createdAt, completedOn },
  editTodo,
  index,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
}) => {
  const [showContent, setShowContent] = useState(false);

  const className = `item${
    editTodo && editTodo._id === _id ? " highlight" : ""
  }${marked && mode === "ADD" ? " marked" : ""}`;

  return (
    <div key={_id} className={className}>
      <div className="content-wrapper">
        <div className="content-index">{`${index + 1}. `}</div>
        <div className="flex column">
          <div
            className={`content ${showContent ? "" : "single-line"}`}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
          {showContent && (
            <div className="item-meta">
              <span>Created -&nbsp;</span>
              <span>{formatDate(createdAt)}</span>
              {marked && (
                <Fragment>
                  <span className="ml mr">&#8226;</span>
                  <span>Completed -&nbsp;</span>
                  <span>{formatDate(completedOn)}</span>
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
      {editTodo && editTodo._id === _id ? (
        <Button className="btn" size="sm" onClick={clearTodo}>
          Cancel
        </Button>
      ) : (
        <div className="actions">
          {!marked && (
            <Icon
              size={12}
              type="check"
              fill={colors.green}
              onClick={() => markTodo(_id)}
            />
          )}
          {showContent && mode === "ADD" && (
            <Fragment>
              <Icon
                size={12}
                fill={colors.yellow}
                type="edit"
                onClick={() => setTodoToEdit(_id)}
              />
              <ConfirmBox onConfirm={() => deleteTodo(_id)}>
                <Icon size={12} type="delete" fill={colors.red} />
              </ConfirmBox>
            </Fragment>
          )}
          <Icon
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
