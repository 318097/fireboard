import React, { Fragment } from "react";
import { Button, Radio, Select, Input, Checkbox } from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { constants } from "../state";

const AddItem = ({ state, dispatch, setAppLoading }) => {
  const { data, editTodo, topics, activeProjectId: projectId } = state;
  const { itemType, content, topic, marked } = data || {};

  const add = async () => {
    if (!content) return;
    setAppLoading(true);
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
    setAppLoading(false);
  };

  const updateTodo = async () => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/${editTodo._id}`, {
      content,
      itemType: "TODO",
    });
    dispatch({ type: constants.UPDATE_TODO, payload: result });
    setAppLoading(false);
  };

  const handleChange = (value) => {
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
              style={{ marginRight: "4px" }}
              placeholder="Topic"
              dropPosition="top"
              options={topics.map(({ _id, content }) => ({
                label: content,
                value: _id,
              }))}
              value={topic}
              onChange={(e, value) => handleTypeChange({ topic: value })}
            />
            <Checkbox
              style={{ margin: "0" }}
              label={"Mark as complete"}
              value={marked}
              onChange={(e, value) => handleTypeChange({ marked: value })}
            />
          </Fragment>
        )}
      </div>

      <div className="controls">
        <Input
          autoFocus
          value={content}
          onChange={(e, value) => handleChange(value)}
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
