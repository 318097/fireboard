import React, { useState } from "react";
import Todo from "./Todo";

const TopicContainer = ({
  topic: { todos = [], content: title, _id, doneCount },
  editTodo,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
  itemVisibilityStatus,
  updateItemStatus,
}) => {
  const [dataVisibility, setDataVisibility] = useState(
    itemVisibilityStatus[_id] ?? true
  );

  const toggleTopic = () => {
    setDataVisibility((prev) => {
      const newValue = !prev;
      updateItemStatus({ [_id]: newValue });
      return newValue;
    });
  };

  if (mode === "VIEW" && !todos.length) return null;

  return (
    <div className="topic-container" key={_id}>
      <div className="topic-header" onClick={toggleTopic}>
        <span>{title}</span>
        {mode === "ADD" && !!todos.length && (
          <span>{`${doneCount}/${todos.length}`}</span>
        )}
      </div>
      {dataVisibility && (
        <div className="topic-content">
          {todos.length ? (
            todos.map((todo, index) => (
              <Todo
                todo={todo}
                key={todo._id}
                editTodo={editTodo}
                index={index}
                setTodoToEdit={setTodoToEdit}
                clearTodo={clearTodo}
                deleteTodo={deleteTodo}
                markTodo={markTodo}
                mode={mode}
                itemVisibilityStatus={itemVisibilityStatus}
                updateItemStatus={updateItemStatus}
              />
            ))
          ) : (
            <div className="empty-message">Empty</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicContainer;
