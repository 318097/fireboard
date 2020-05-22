import React, { useReducer, useEffect, Fragment } from "react";
import colors, { Card, Icon, Button, Radio, Select } from "@ml318097/react-ui";
import { ConfirmBox } from "../../UIComponents";
import "./Todos.scss";
import { getData, setData } from "../../utils.js";
import { constants, reducer, initialState } from "./state";

const Todos = ({ toggleState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, topics, loading, editTodo } = state;

  useEffect(() => {
    getData("dot", data => {
      const {
        todos = [],
        topics = [
          {
            id: "others",
            content: "Others",
            createdAt: new Date().toISOString(),
            todos: []
          }
        ]
      } = data.dot || {};
      console.log(todos, topics);
      dispatch({ type: constants.SET_TODOS, payload: todos });
      dispatch({ type: constants.SET_TOPICS, payload: topics });
    });
    setTimeout(() => {
      dispatch({ type: constants.SET_LOADING, payload: false });
    }, 200);
  }, []);

  useEffect(() => {
    if (!loading) setData("dot", { todos, topics });
  }, [todos, topics]);

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
        <Icon type="cancel-2" />
      </span>
      <Card curved bottomLine={false}>
        <div className="header">
          <span className="flex">
            <span>Todos</span>
          </span>
          <span>Total: {todos.length}</span>
        </div>
        <div className="list-container">
          {topics.length ? (
            topics.map(({ todos: todoIds = [], content: title, id }) => {
              const matchedTodos = todos.filter(todo =>
                todoIds.includes(todo.id)
              );
              return (
                <div className="topic-container" key={id}>
                  <div className="topic-header">{title}</div>
                  <div className="topic-content">
                    {matchedTodos.map(({ content, id, marked }, index) => (
                      <div
                        key={id}
                        className={`item${
                          editTodo && editTodo.id === id ? " highlight" : ""
                        } ${marked ? "marked" : ""}`}
                      >
                        <div className="content">{`${index +
                          1}. ${content}`}</div>
                        <div className="actions">
                          {editTodo && editTodo.id === id ? (
                            <Button onClick={clearTodo}>Cancel</Button>
                          ) : (
                            <span className="actionButtons">
                              <Icon
                                size={14}
                                type="check"
                                fill={colors.green}
                                onClick={() => markTodo(id)}
                              />
                              <Icon
                                size={14}
                                fill={colors.yellow}
                                type="edit"
                                onClick={() => setTodoToEdit(id)}
                              />

                              <ConfirmBox onConfirm={() => deleteTodo(id)}>
                                <Icon
                                  size={14}
                                  type="delete"
                                  fill={colors.red}
                                />
                              </ConfirmBox>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
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
  const { data, editTodo, topics } = state;
  const { itemType, content, topic } = data || {};

  const add = () => {
    if (!content) return;
    dispatch({
      type: itemType === "TODO" ? constants.ADD_TODO : constants.ADD_TOPIC
    });
  };

  const updateTodo = () => dispatch({ type: constants.UPDATE_TODO });

  const handleChange = e => {
    const {
      target: { value }
    } = e;
    dispatch({ type: constants.SET_DATA, payload: { content: value } });
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) add();
  };

  const handleTypeChange = update =>
    dispatch({ type: constants.SET_DATA, payload: update });

  return (
    <div className="addContainer">
      <div className="options">
        <div className="addType">
          <Radio
            options={[
              { label: "Todo", value: "TODO" },
              { label: "Topic", value: "TOPIC" }
            ]}
            value={itemType}
            onChange={value => handleTypeChange({ itemType: value })}
          />
        </div>
        {itemType === "TODO" && (
          <div className="todoClassification">
            <Select
              placeholder="Select topic"
              dropPosition="top"
              options={topics.map(({ id, content }) => ({
                label: content,
                value: id
              }))}
              value={topic}
              onChange={value => handleTypeChange({ topic: value })}
            />
          </div>
        )}
      </div>

      <div className="controls">
        <textarea
          autoFocus
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="inputbox"
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}..`}
        />
        {editTodo && editTodo.mode === "EDIT" ? (
          <Button onClick={updateTodo}>Update</Button>
        ) : (
          <Button onClick={add}>Add</Button>
        )}
      </div>
    </div>
  );
};

export default Todos;
