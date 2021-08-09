import { Button, Checkbox, Radio, Input, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import React, { Fragment } from "react";
import "./AddItem.scss";
import { constants } from "../../../state";
import handleError from "../../../lib/errorHandling";
import notify from "../../../lib/notify";

const { Option } = Select;

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

  const handleEnter = () => {
    // if (!e.shiftKey && e.keyCode === 13)
    if (editTodo?.mode === "EDIT") updateTodo();
    else add();
  };

  const handleChange = (update) =>
    dispatch({ type: constants.SET_DATA, payload: update });

  const clearFields = () =>
    dispatch({
      type: constants.CLEAR,
    });

  const showClearButton =
    itemType !== "TODO" || !!content || !!parentId || marked || deadline;

  return (
    <div className="add-container">
      <div className="options">
        <Radio.Group
          size="small"
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "Topic", value: "TOPIC" },
            { label: "Todo", value: "TODO" },
          ]}
          value={itemType}
          onChange={(e) => handleChange({ itemType: e.target.value })}
        />
        {itemType === "TODO" && (
          <Fragment>
            <Select
              size="small"
              allowClear
              style={{ width: 120 }}
              placeholder="Topic"
              value={parentId}
              onChange={(value) => handleChange({ parentId: value })}
            >
              {topics.map(({ _id, content }) => (
                <Option key={_id} value={_id}>
                  {content}
                </Option>
              ))}
            </Select>
            <DatePicker
              allowClear
              placeholder="Deadline"
              size="small"
              value={typeof deadline === "string" ? moment(deadline) : deadline}
              onChange={(date) => handleChange({ deadline: date })}
            />
            <Checkbox
              size="small"
              checked={marked}
              onChange={(e) => handleChange({ marked: e.target.checked })}
            >
              Mark completed
            </Checkbox>
          </Fragment>
        )}
        {showClearButton && (
          <Button size="small" type="link" onClick={clearFields}>
            Clear
          </Button>
        )}
      </div>

      <div className="controls">
        <Input
          allowClear
          autoFocus
          value={content}
          onChange={(e) => handleChange({ content: e.target.value })}
          onPressEnter={handleEnter}
          placeholder={`Enter ${itemType === "TODO" ? "Todo" : "Topic"}`}
        />
        {editTodo && editTodo.mode === "EDIT" ? (
          <Button disabled={appLoading} onClick={updateTodo}>
            Update
          </Button>
        ) : (
          <Button disabled={appLoading || !content} onClick={add}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
