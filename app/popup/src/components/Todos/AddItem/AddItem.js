import React, { Fragment } from "react";
import colors, {
  Button,
  Radio,
  Select,
  TextArea,
  Checkbox,
  StatusBar,
} from "@codedrops/react-ui";
import moment from "moment";
import axios from "axios";
import "./AddItem.scss";
import { constants } from "../../../state";
import { handleError } from "../../../lib/errorHandling";

const { notify } = StatusBar;

const AddItem = ({ state, dispatch, setLoading }) => {
  const { data, editTodo, topics, activeProjectId: projectId, loading } = state;
  const { itemType, content, marked, deadline } = data || {};
  let { topicId } = data || {};

  console.log("data::-", data);

  const add = async () => {
    if (!content) return;
    try {
      setLoading(true);
      if (itemType === "TOPIC") {
        const {
          data: { result },
        } = await axios.post("/dot/topics", {
          content,
          projectId,
        });

        dispatch({
          type: constants.ADD_TOPIC,
          payload: result,
        });
      } else {
        if (!topicId) {
          topicId = topics.find(
            (topic) => topic.content === "others" || topic.isDefault
          )._id;
        }
        const {
          data: { result },
        } = await axios.post("/dot/todos", {
          content,
          topicId,
          projectId,
          marked,
          deadline,
        });

        dispatch({
          type: constants.ADD_TODO,
          payload: result,
        });
      }
      notify(itemType === "TOPIC" ? "Topic created" : "Todo created");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async () => {
    setLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/todos/${editTodo._id}`, {
      ...data,
      itemType: "TODO",
    });
    dispatch({ type: constants.UPDATE_TODO, payload: result });

    notify("Todo updated");
    setLoading(false);
  };

  const handleChange = (value) => {
    dispatch({ type: constants.SET_DATA, payload: { content: value } });
  };

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13)
      editTodo && editTodo.mode === "EDIT" ? updateTodo() : add();
  };

  const handleTypeChange = (update) =>
    dispatch({ type: constants.SET_DATA, payload: update });

  const clearFields = () => {
    dispatch({
      type: constants.CLEAR,
    });
  };

  const showClearButton =
    itemType !== "TODO" || !!content || !!topicId || marked || deadline;

  return (
    <div className="add-container">
      <div className="options">
        <Radio
          options={[
            { label: "Todo", value: "TODO" },
            { label: "Topic", value: "TOPIC" },
          ]}
          value={itemType}
          onChange={(e, value) => handleTypeChange({ itemType: value })}
        />
        {itemType === "TODO" && (
          <Fragment>
            <Select
              placeholder="Topic"
              dropPosition="top"
              options={topics.map(({ _id, content }) => ({
                label: content,
                value: _id,
              }))}
              value={topicId}
              onChange={(e, value) => handleTypeChange({ topicId: value })}
            />
            <Checkbox
              style={{ flexShrink: "0" }}
              label={"Done"}
              value={marked}
              onChange={(e, value) => handleTypeChange({ marked: value })}
            />
            <input
              type="date"
              className="react-ui-base"
              value={moment(deadline).format("YYYY-MM-DD")}
              style={{ width: "146px" }}
              onChange={(e) => handleTypeChange({ deadline: e.target.value })}
            />
          </Fragment>
        )}
        {showClearButton && (
          <Button
            type="link"
            color={colors.blue}
            className="btn"
            onClick={clearFields}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="controls">
        <TextArea
          autoFocus
          value={content}
          onChange={(e, value) => handleChange(value)}
          onKeyDown={handleKeyDown}
          className="inputbox"
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}`}
        />
        {editTodo && editTodo.mode === "EDIT" ? (
          <Button disabled={loading} className="btn" onClick={updateTodo}>
            Update
          </Button>
        ) : (
          <Button disabled={loading || !content} className="btn" onClick={add}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
