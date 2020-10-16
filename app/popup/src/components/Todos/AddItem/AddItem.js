import React from "react";
import colors, {
  Card,
  Icon,
  Button,
  Radio,
  Select,
  Input,
} from "@codedrops/react-ui";
import axios from "axios";
import "./AddItem.scss";
import { constants, reducer, initialState } from "../state";

const AddItem = ({ state, dispatch }) => {
  const { data, editTodo, topics } = state;
  const { itemType, content, topic } = data || {};

  const add = async () => {
    if (!content) return;
    const {
      data: { result },
    } = await axios.post("/dot", {
      content,
      topicId: topic || undefined,
      itemType,
    });

    dispatch({
      type: itemType === "TODO" ? constants.ADD_TODO : constants.ADD_TOPIC,
      payload: result,
    });
  };

  const updateTodo = () => dispatch({ type: constants.UPDATE_TODO });

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
