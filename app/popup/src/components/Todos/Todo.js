import React from "react";
import colors, { Icon, Button, ConfirmBox } from "@codedrops/react-ui";

const Todo = ({
  todo: { content, _id, marked },
  editTodo,
  index,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
}) => {
  const className = `item ${
    editTodo && editTodo._id === _id ? "highlight" : ""
  } ${marked && mode === "ADD" ? "marked" : ""}`;

  return (
    <div key={_id} className={className}>
      <div className="content">{`${index + 1}. ${content}`}</div>
      {mode === "ADD" && (
        <div className="actions">
          {editTodo && editTodo._id === _id ? (
            <Button className="btn" onClick={clearTodo}>
              Cancel
            </Button>
          ) : (
            <span className="actionButtons">
              {!marked && (
                <Icon
                  size={12}
                  type="check"
                  fill={colors.green}
                  onClick={() => markTodo(_id)}
                />
              )}
              <Icon
                size={12}
                fill={colors.yellow}
                type="edit"
                onClick={() => setTodoToEdit(_id)}
              />

              <ConfirmBox onConfirm={() => deleteTodo(_id)}>
                <Icon size={12} type="delete" fill={colors.red} />
              </ConfirmBox>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Todo;
