import React from "react";
import Todo from "./Todo";
import { Empty } from "antd";

const TopicContainer = ({
  topic: { todos = [], _id, doneCount },
  editTodo,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo,
  mode,
  updateItemStatus,
}) => {
  if (mode === "VIEW" && !todos.length) return null;
  if (!todos.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className="topic-content gap">
      {todos.map((todo, index) => (
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
          updateItemStatus={updateItemStatus}
        />
      ))}
    </div>
  );
};

/* <div className="topic-header" onClick={toggleTopic}>
        <span>{title}</span>
        {mode === "ADD" && !!todos.length && (
          <span>{`${doneCount}/${todos.length}`}</span>
        )}
      </div> */

export default TopicContainer;
