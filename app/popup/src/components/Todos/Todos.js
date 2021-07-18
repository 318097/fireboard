import { StatusBar } from "@codedrops/react-ui";
import axios from "axios";
import React from "react";
import "./Todos.scss";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData } from "../../lib/helpers";
import { constants } from "../../state";
import AddItem from "./AddItem";
import TopicContainer from "./TopicContainer";
import { handleError } from "@codedrops/lib";

const { notify } = StatusBar;

const Todos = ({ state, dispatch, mode, setLoading }) => {
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
    try {
      setLoading(true);
      await axios.delete(`/dot/todos/${_id}`);
      dispatch({ type: constants.DELETE_TODO, payload: _id });
      notify("Deleted");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const markTodo = async (_id) => {
    setLoading(true);
    try {
      const {
        data: { result },
      } = await axios.put(`/dot/todos/${_id}/stamp`);
      dispatch({ type: constants.MARK_TODO, payload: result });
      notify("Marked as done");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
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
        <AddItem state={state} dispatch={dispatch} setLoading={setLoading} />
      )}
    </section>
  );
};

export default Todos;
