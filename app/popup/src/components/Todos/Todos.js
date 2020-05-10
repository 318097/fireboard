import React, { useState, Fragment } from "react";
import { v4 as uuid } from "uuid";

import { ConfirmBox } from "../../UIComponents";
import { CloseIcon, EditIcon, DeleteIcon } from "../../assets/icons";
import "./Todos.scss";

const Todos = ({ toggleState }) => {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [editTodo, setEditTodo] = useState(null);

  const addTodo = () => {
    if (!content) return;

    setTodos(prev => [
      ...prev,
      {
        id: uuid(),
        content,
        createdAt: new Date().toISOString()
      }
    ]);
    setContent("");
  };

  const setTodoToEdit = id => {
    setEditTodo({
      id,
      mode: "EDIT"
    });
    const matchedTodo = todos.find(item => item.id === id);
    setContent(matchedTodo.content);
  };

  const updateTodo = () => {
    const { id } = editTodo;
    setTodos(prev => [
      ...prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            content
          };
        }
        return item;
      })
    ]);
    clearTodo();
  };

  const clearTodo = () => {
    setContent("");
    setEditTodo(null);
  };

  const deleteTodo = id =>
    setTodos(prev => [...prev.filter(item => item.id !== id)]);

  return (
    <div className="dot-container">
      <span className="close-icon" onClick={toggleState}>
        <CloseIcon />
      </span>
      <section>
        <div className="header">
          <span className="flex">
            <span>Todos</span>
          </span>
          <span>Total: {todos.length}</span>
        </div>
        <div className="listContainer">
          {todos.length ? (
            todos.map(({ content, id }) => (
              <div
                key={id}
                className={`item${
                  editTodo && editTodo.id === id ? " highlight" : ""
                }`}
              >
                <div className="content">{content}</div>
                <div className="actions">
                  {editTodo && editTodo.id === id ? (
                    <button className="btn" onClick={clearTodo}>
                      Cancel
                    </button>
                  ) : (
                    <span className="actionButtons">
                      <span
                        onClick={() => setTodoToEdit(id)}
                        className="icon edit-icon"
                      >
                        <EditIcon />
                      </span>
                      <ConfirmBox onConfirm={() => deleteTodo(id)}>
                        <span className="icon delete-icon">
                          <DeleteIcon />
                        </span>
                      </ConfirmBox>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message">Empty</div>
          )}
        </div>

        <div className="controls">
          <textarea
            value={content}
            onChange={({ target: { value } }) => setContent(value)}
            className="inputbox"
            placeholder="Enter Todo.."
          />
          {editTodo && editTodo.mode === "EDIT" ? (
            <button onClick={updateTodo} className="btn">
              Update
            </button>
          ) : (
            <button onClick={addTodo} className="btn">
              Add
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Todos;
