import React from "react";
import axios from "axios";

import "./Todos.scss";
import { constants } from "./state";
import AddItem from "./AddItem";
import { formatData } from "../../helpers";
import TopicContainer from "./TopicContainer";
import BlockerScreen from "../../BlockerScreen";

const Todos = ({ state, dispatch, mode, setAppLoading }) => {
  const { todos, topics, editTodo, pendingTasksOnly } = state;

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
    setAppLoading(true);
    await axios.delete(`/dot/todos/${_id}`);
    dispatch({ type: constants.DELETE_TODO, payload: _id });
    setAppLoading(false);
  };

  const markTodo = async (_id) => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/todos/${_id}/stamp`);
    dispatch({ type: constants.MARK_TODO, payload: result });
    setAppLoading(false);
  };

  const data = formatData({
    todos,
    topics,
    today: mode === "VIEW",
    pendingTasksOnly,
  });

  return (
    <section>
      <BlockerScreen state={state} />
      <div className="list-container">
        {data.length ? (
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

      {mode === "ADD" && (
        <AddItem
          state={state}
          dispatch={dispatch}
          setAppLoading={setAppLoading}
        />
      )}
    </section>
  );
};

export default Todos;
