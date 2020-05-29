import React from "react";
import colors, { Card, Icon, Button, Radio, Select } from "@codedrops/react-ui";
import "./AddItem.scss";
import { constants, reducer, initialState } from "../state";

const AddItem = ({ state, dispatch }) => {
  const { data, editTodo, topics } = state;
  const { itemType, content, topic } = data || {};

  const add = () => {
    if (!content) return;
    dispatch({
      type: itemType === "TODO" ? constants.ADD_TODO : constants.ADD_TOPIC
    });
  };

  const updateTodo = () => dispatch({ type: constants.UPDATE_TODO });

  const handleChange = e => {
    const {
      target: { value }
    } = e;
    dispatch({ type: constants.SET_DATA, payload: { content: value } });
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) add();
  };

  const handleTypeChange = update =>
    dispatch({ type: constants.SET_DATA, payload: update });

  return (
    <div className="addContainer">
      <div className="options">
        <div className="addType">
          <Radio
            options={[
              { label: "Todo", value: "TODO" },
              { label: "Topic", value: "TOPIC" }
            ]}
            value={itemType}
            onChange={value => handleTypeChange({ itemType: value })}
          />
        </div>
        {itemType === "TODO" && (
          <div className="todoClassification">
            <Select
              placeholder="Select topic"
              dropPosition="top"
              options={topics.map(({ id, content }) => ({
                label: content,
                value: id
              }))}
              value={topic}
              onChange={value => handleTypeChange({ topic: value })}
            />
          </div>
        )}
      </div>

      <div className="controls">
        <textarea
          autoFocus
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="inputbox"
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}..`}
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
