import React, { useState, useEffect, Fragment } from "react";
import { v4 as uuid } from "uuid";
import colors, { Card, Icon, Button } from "@ml318097/react-ui";
import { ConfirmBox } from "../../UIComponents";
import "./Todos.scss";
import { getData, setData } from "../../utils.js";

const Todos = ({ toggleState }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    getData("todos", data => {
      const { todos = [] } = data || {};
      setTodos(todos);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && todos.length) setData("todos", [...todos]);
  }, [todos]);

  const addTodo = () => {
    if (!content) return;

    setTodos(prev => [
      ...prev,
      {
        id: uuid(),
        content,
        createdAt: new Date().toISOString(),
        marked: false
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

  const markTodo = id =>
    setTodos(prev =>
      prev.map(todo => {
        if (todo.id === id)
          return {
            ...todo,
            marked: true
          };

        return todo;
      })
    );

  const handleChange = e => {
    const {
      target: { value }
    } = e;
    setContent(value);
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) addTodo();
  };

  return (
    <div className="dot-container">
      <span className="close-icon" onClick={toggleState}>
        <Icon type="cancel-red" />
      </span>
      <Card curved bottomLine={false}>
        <div className="header">
          <span className="flex">
            <span>Todos</span>
          </span>
          <span>Total: {todos.length}</span>
        </div>
        <div className="listContainer">
          {todos.length ? (
            todos.map(({ content, id, marked }, index) => (
              <div
                key={id}
                className={`item${
                  editTodo && editTodo.id === id ? " highlight" : ""
                } ${marked ? "marked" : ""}`}
              >
                <div className="content">{`${index + 1}. ${content}`}</div>
                <div className="actions">
                  {editTodo && editTodo.id === id ? (
                    <Button onClick={clearTodo}>Cancel</Button>
                  ) : (
                    <span className="actionButtons">
                      <Icon
                        type="check"
                        fill={colors.green}
                        onClick={() => markTodo(id)}
                      />
                      <Icon
                        fill={colors.yellow}
                        type="edit"
                        onClick={() => setTodoToEdit(id)}
                      />

                      <ConfirmBox onConfirm={() => deleteTodo(id)}>
                        <Icon type="delete" fill={colors.red} />
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
            autoFocus
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="inputbox"
            placeholder="Enter Todo.."
          />
          {editTodo && editTodo.mode === "EDIT" ? (
            <Button onClick={updateTodo}>Update</Button>
          ) : (
            <Button onClick={addTodo}>Add</Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Todos;
