import axios from "axios";
import React from "react";
import "./Todos.scss";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData } from "../../lib/helpers";
import { constants } from "../../state";
import AddItem from "./AddItem";
import TopicContainer from "./TopicContainer";
import handleError from "../../lib/errorHandling";
import notify from "../../lib/notify";

const Todos = ({ state, dispatch, mode, setAppLoading, updateItemStatus }) => {
  const { todos, topics, editTodo, pendingTasksOnly, itemVisibilityStatus } =
    state;

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
      setAppLoading(true);
      await axios.delete(`/dot/tasks/${_id}`);
      dispatch({ type: constants.DELETE_TODO, payload: _id });
      notify("Deleted");
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const markTodo = async (_id) => {
    setAppLoading(true);
    try {
      const {
        data: { result },
      } = await axios.put(`/dot/tasks/${_id}/stamp`);
      dispatch({ type: constants.MARK_TODO, payload: result });
      notify("Marked as done");
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
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
              updateItemStatus={updateItemStatus}
              itemVisibilityStatus={itemVisibilityStatus}
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
