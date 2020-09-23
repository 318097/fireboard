import React from "react";
import "./Todos.scss";
import { constants } from "./state";
import AddItem from "./AddItem";
import { formatData } from "../../helpers";
import TopicContainer from "./TopicContainer";

const Todos = ({ state, dispatch, mode }) => {
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

  const data = formatData({ todos, topics, today: mode === "VIEW" });

  return (
    <section>
      <div className="list-container">
        {todos.length ? (
          data.map(topic => (
            <TopicContainer
              key={topic.id}
              topic={topic}
              editTodo={editTodo}
              setTodoToEdit={setTodoToEdit}
              clearTodo={clearTodo}
              deleteTodo={deleteTodo}
              markTodo={markTodo}
              mode={mode}
            />
          ))
        ) : (
          <div className="empty-message">Empty</div>
        )}
      </div>

      {mode === "ADD" && <AddItem state={state} dispatch={dispatch} />}
    </section>
  );
};

export default Todos;
