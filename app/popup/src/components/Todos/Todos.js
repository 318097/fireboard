import React, { useReducer, useEffect, Fragment } from "react";
import colors, { Card, Icon, Button } from "@ml318097/react-ui";
import { ConfirmBox } from "../../UIComponents";
import "./Todos.scss";
import { getData, setData } from "../../utils.js";
import { constants, reducer, initialState } from "./state";

const Todos = ({ toggleState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, loading, editTodo } = state;

  useEffect(() => {
    getData("todos", data => {
      const { todos = [] } = data || {};
      dispatch({ type: constants.SET_TODOS, payload: todos });
    });
  }, []);

  useEffect(() => {
    if (!loading && todos.length) setData("todos", [...todos]);
  }, [todos]);

  const setTodoToEdit = id => {
    dispatch({
      type: constants.SET_EDIT_TODO,
      payload: {
        id,
        mode: "EDIT"
      }
    });
  };

  const clearTodo = () => dispatch({ type: constants.CLEAR });

  const deleteTodo = id =>
    dispatch({ type: constants.DELETE_TODO, payload: id });

  const markTodo = id => dispatch({ type: constants.MARK_TODO, payload: id });

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

        <AddItem state={state} dispatch={dispatch} />
      </Card>
    </div>
  );
};

const AddItem = ({ state, dispatch }) => {
  const { content, todos, editTodo } = state;

  const addTodo = () => {
    if (!content) return;
    dispatch({ type: constants.ADD_TODO });
  };

  const updateTodo = () => dispatch({ type: constants.UPDATE_TODO });

  const handleChange = e => {
    const {
      target: { value }
    } = e;
    dispatch({ type: constants.SET_CONTENT, payload: value });
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) addTodo();
  };

  return (
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
  );
};

export default Todos;
