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
import _ from "lodash";
import { Collapse, Empty } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

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

  const topicSettings = (
    <SettingOutlined
      onClick={(event) => {
        event.stopPropagation();
      }}
    />
  );

  const updateVisibilityStatus = (updates) => {
    updateItemStatus(updates);
  };

  return (
    <section>
      <BlockerScreen state={state} />
      {data.length ? (
        <div className="list-container">
          <Collapse
            defaultActiveKey={itemVisibilityStatus}
            onChange={updateVisibilityStatus}
            expandIconPosition={"right"}
          >
            {data.map((topic) => (
              <Panel
                size="small"
                header={<span className="topic-name">{topic.content}</span>}
                key={topic._id}
                extra={topicSettings}
              >
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
              </Panel>
            ))}
          </Collapse>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

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
