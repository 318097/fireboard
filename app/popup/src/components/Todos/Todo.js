import React from "react";
import colors, { Icon, Button, ConfirmBox } from "@codedrops/react-ui";

const Todo = ({
  todo: { content, id, marked },
  editTodo,
  index,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo
}) => {
  return (
    <div
      key={id}
      className={`item${editTodo && editTodo.id === id ? " highlight" : ""} ${
        marked ? "marked" : ""
      }`}
    >
      <div className="content">{`${index + 1}. ${content}`}</div>
      <div className="actions">
        {editTodo && editTodo.id === id ? (
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
                onClick={() => markTodo(id)}
              />
            )}
            <Icon
              size={12}
              fill={colors.yellow}
              type="edit"
              onClick={() => setTodoToEdit(id)}
            />

            <ConfirmBox onConfirm={() => deleteTodo(id)}>
              <Icon size={12} type="delete" fill={colors.red} />
            </ConfirmBox>
          </span>
        )}
      </div>
    </div>
  );
};

export default Todo;
