import React from "react";
import axios from "axios";

import "./Todos.scss";
import { constants } from "./state";
import AddItem from "./AddItem";
import { formatData } from "../../helpers";
import TopicContainer from "./TopicContainer";

const Todos = ({ state, dispatch, mode }) => {
  const { todos, topics, editTodo } = state;

  const setTodoToEdit = (_id) => {
    dispatch({
      type: constants.SET_EDIT_TODO,
      payload: {
        _id,
        mode: "EDIT",
      },
    });
  };

  const clearTodo = () => dispatch({ type: constants.CLEAR });

  const deleteTodo = async (_id) => {
    await axios.delete(`/dot/${_id}`);
    dispatch({ type: constants.DELETE_TODO, payload: _id });
  };

  const markTodo = (_id) =>
    dispatch({ type: constants.MARK_TODO, payload: _id });

  const data = formatData({ todos, topics, today: mode === "VIEW" });

  return (
    <section>
      <div className="list-container">
        {todos.length ? (
          data.map((topic) => (
            <TopicContainer
              key={topic._id}
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
