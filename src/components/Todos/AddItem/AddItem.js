import { Button, Checkbox, Radio, Input, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import React, { Fragment } from "react";
import "./AddItem.scss";
import { constants } from "../../../state";
import handleError from "../../../lib/errorHandling";
import tracker from "../../../lib/mixpanel";
import notify from "../../../lib/notify";

const { Option } = Select;

const AddItem = ({ state, dispatch, setAppLoading, updateTask }) => {
  const {
    data,
    selectedTask,
    topics,
    activeProjectId: projectId,
    appLoading,
  } = state;
  const { type, content, marked, deadline } = data || {};
  let { parentId } = data || {};

  const addTask = async () => {
    if (!content) return;
    try {
      setAppLoading(true);
      let formData = {
        content,
        projectId,
        type,
      };
      if (type === "TODO") {
        if (!parentId) parentId = topics.find((topic) => topic.isDefault)?._id;

        formData = {
          ...formData,
          parentId,
          marked,
          deadline,
        };
      }
      const {
        data: { result },
      } = await axios.post("/dot/tasks", formData);

      dispatch({
        type: type === "TOPIC" ? constants.ADD_TOPIC : constants.ADD_TODO,
        payload: result,
      });
      notify(type === "TOPIC" ? "Topic created" : "Todo created");
      tracker.track("ADD_TASK", { type: type });
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleEnter = () => {
    // if (!e.shiftKey && e.keyCode === 13)
    if (selectedTask?.mode === "EDIT") updateTask(selectedTask._id, data);
    else addTask();
  };

  const handleChange = (update) =>
    dispatch({ type: constants.SET_DATA, payload: update });

  const clearFields = () =>
    dispatch({
      type: constants.CLEAR,
    });

  const showClearButton =
    type !== "TODO" || !!content || !!parentId || marked || deadline;

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
          value={type}
          onChange={(e) => handleChange({ type: e.target.value })}
        />
        {type === "TODO" && (
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
          placeholder={`Enter ${type === "TODO" ? "Todo" : "Topic"}`}
        />
        {selectedTask?.mode === "EDIT" ? (
          <Button disabled={appLoading} onClick={updateTask}>
            Update
          </Button>
        ) : (
          <Button disabled={appLoading || !content} onClick={addTask}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
