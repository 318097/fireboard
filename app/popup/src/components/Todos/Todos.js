import React, { useState } from "react";
import colors, { Icon, Button, ConfirmBox } from "@codedrops/react-ui";
import "./Todos.scss";
import { constants } from "./state";
import AddItem from "./AddItem";

const Todos = ({ state, dispatch }) => {
  const { todos, topics, editTodo } = state;
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
    <section>
      <div className="list-container">
        {todos.length ? (
          topics.map(topic => (
            <TopicContainer
              key={topic.id}
              topic={topic}
              editTodo={editTodo}
              todos={todos}
              setTodoToEdit={setTodoToEdit}
              clearTodo={clearTodo}
              deleteTodo={deleteTodo}
              markTodo={markTodo}
            />
          ))
        ) : (
          <div className="empty-message">Empty</div>
        )}
      </div>

      <AddItem state={state} dispatch={dispatch} />
    </section>
  );
};

const TopicContainer = ({
  topic: { todos: todoIds = [], content: title, id },
  editTodo,
  todos,
  setTodoToEdit,
  clearTodo,
  deleteTodo,
  markTodo
}) => {
  const [dataVisibility, setDataVisibility] = useState(true);

  let doneCount = 0;
  const matchedTodos = todos.filter(todo => {
    if (todoIds.includes(todo.id)) {
      if (todo.marked) doneCount++;
      return true;
    }
    return false;
  });
  return (
    <div className="topic-container" key={id}>
      <div
        className="topic-header"
        onClick={() => setDataVisibility(prev => !prev)}
      >
        <span>{title}</span>
        {!!matchedTodos.length && (
          <span>{`${doneCount}/${matchedTodos.length}`}</span>
        )}
      </div>
      {dataVisibility && (
        <div className="topic-content">
          {matchedTodos.length ? (
            matchedTodos.map((todo, index) => (
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

export default Todos;
