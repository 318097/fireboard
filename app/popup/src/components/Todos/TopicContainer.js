import React, { useState } from "react";
import Todo from "./Todo";

const TopicContainer = ({
  topic: { todos = [], content: title, id, doneCount },
  editTodo,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo
}) => {
  const [dataVisibility, setDataVisibility] = useState(true);

  return (
    <div className="topic-container" key={id}>
      <div
        className="topic-header"
        onClick={() => setDataVisibility(prev => !prev)}
      >
        <span>{title}</span>
        {!!todos.length && <span>{`${doneCount}/${todos.length}`}</span>}
      </div>
      {dataVisibility && (
        <div className="topic-content">
          {todos.length ? (
            todos.map((todo, index) => (
              <Todo
                todo={todo}
                key={todo.id}
                editTodo={editTodo}
                index={index}
                setTodoToEdit={setTodoToEdit}
                clearTodo={clearTodo}
                deleteTodo={deleteTodo}
                markTodo={markTodo}
              />
            ))
          ) : (
            <div className="empty-todo-list">Empty List</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicContainer;
