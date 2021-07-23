import colors, {
  Button,
  Checkbox,
  Radio,
  Select,
  TextArea,
} from "@codedrops/react-ui";
import axios from "axios";
import moment from "moment";
import React, { Fragment } from "react";
import "./AddItem.scss";
import { constants } from "../../../state";
import handleError from "../../../lib/errorHandling";
import notify from "../../../lib/notify";

const AddItem = ({ state, dispatch, setAppLoading }) => {
  const {
    data,
    editTodo,
    topics,
    activeProjectId: projectId,
    appLoading,
  } = state;
  const { itemType, content, marked, deadline } = data || {};
  let { parentId } = data || {};

  // console.log("data::-", data);

  const add = async () => {
    if (!content) return;
    try {
      setAppLoading(true);
      if (itemType === "TOPIC") {
        const {
          data: { result },
        } = await axios.post("/dot/tasks", {
          content,
          projectId,
          type: "TOPIC",
        });

        dispatch({
          type: constants.ADD_TOPIC,
          payload: result,
        });
      } else {
        if (!parentId) {
          parentId = topics.find((topic) => topic.isDefault)?._id;
        }
        const {
          data: { result },
        } = await axios.post("/dot/tasks", {
          content,
          parentId,
          projectId,
          marked,
          type: "TODO",
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
      setAppLoading(false);
    }
  };

  const updateTodo = async () => {
    setAppLoading(true);
    const {
      data: { result },
    } = await axios.put(`/dot/tasks/${editTodo._id}`, {
      ...data,
      itemType: "TODO",
    });
    dispatch({ type: constants.UPDATE_TODO, payload: result });

    notify("Todo updated");
    setAppLoading(false);
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
    itemType !== "TODO" || !!content || !!parentId || marked || deadline;

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
              value={parentId}
              onChange={(e, value) => handleTypeChange({ parentId: value })}
            />
            <Checkbox
              style={{ flexShrink: "0" }}
              label={"Mark as done"}
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
            className="ui-button"
            skipDefaultClass={true}
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
          className="ui-textarea"
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}`}
        />
        {editTodo && editTodo.mode === "EDIT" ? (
          <Button
            disabled={appLoading}
            className="ui-button"
            skipDefaultClass={true}
            onClick={updateTodo}
          >
            Update
          </Button>
        ) : (
          <Button
            disabled={appLoading || !content}
            className="ui-button"
            skipDefaultClass={true}
            onClick={add}
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
