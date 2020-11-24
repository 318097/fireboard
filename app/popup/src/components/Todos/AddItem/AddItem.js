import React, { Fragment } from "react";
import { Button, Radio, Select, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { constants } from "../state";

const AddItem = ({ state, dispatch }) => {
  const { data, editTodo, topics, activeProjectId: projectId } = state;
  const { itemType, content, topic, marked } = data || {};

  const add = async () => {
    if (!content) return;

    let topicId = topic;
    if (itemType === "TODO" && !topic) {
      topicId = topics.find((topic) => topic.content === "others")._id;
    }
    const {
      data: { result },
    } = await axios.post("/dot", {
      content,
      topicId,
      itemType,
      projectId,
      marked,
    });

    dispatch({
      type: itemType === "TODO" ? constants.ADD_TODO : constants.ADD_TOPIC,
      payload: result,
    });
  };

  const updateTodo = async () => {
    const {
      data: { result },
    } = await axios.put(`/dot/${editTodo._id}`, {
      content,
      itemType: "TODO",
    });
    dispatch({ type: constants.UPDATE_TODO, payload: result });
  };

  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    dispatch({ type: constants.SET_DATA, payload: { content: value } });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) add();
  };

  const handleTypeChange = (update) =>
    dispatch({ type: constants.SET_DATA, payload: update });

  return (
    <div className="add-container">
      <div className="options">
        <div className="add-type">
          <Radio
            options={[
              { label: "Todo", value: "TODO" },
              { label: "Topic", value: "TOPIC" },
            ]}
            value={itemType}
            onChange={(value) => handleTypeChange({ itemType: value })}
          />
        </div>
        {itemType === "TODO" && (
          <Fragment>
            <div className="todo-classification">
              <Select
                placeholder="Select topic"
                dropPosition="top"
                options={topics.map(({ _id, content }) => ({
                  label: content,
                  value: _id,
                }))}
                value={topic}
                onChange={(value) => handleTypeChange({ topic: value })}
              />
            </div>
            <div className="flex row center">
              <input
                type="checkbox"
                onChange={() => handleTypeChange({ marked: !marked })}
                checked={marked}
              />
              Mark as complete
            </div>
          </Fragment>
        )}
      </div>

      <div className="controls">
        <Input
          autoFocus
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="inputbox"
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}`}
        />
        {editTodo && editTodo.mode === "EDIT" ? (
          <Button className="btn" onClick={updateTodo}>
            Update
          </Button>
        ) : (
          <Button className="btn" onClick={add}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
