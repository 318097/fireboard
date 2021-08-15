import {
  Button,
  Checkbox,
  SegmentedControl,
  Select,
  Input,
} from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import "./AddItem.scss";
import { constants } from "../../../state";
import handleError from "../../../lib/errorHandling";
import tracker from "../../../lib/mixpanel";
import notify from "../../../lib/notify";
import { DatePicker } from "@mantine/dates";

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

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      if (selectedTask?.mode === "EDIT") updateTask(selectedTask._id, data);
      else addTask();
    }
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
        <SegmentedControl
          radius="xs"
          size="xs"
          data={[
            { label: "Topic", value: "TOPIC" },
            { label: "Todo", value: "TODO" },
          ]}
          value={type}
          onChange={(value) => handleChange({ type: value })}
        />
        {type === "TODO" && (
          <Fragment>
            <Select
              radius="xs"
              size="xs"
              placeholder="Topic"
              data={topics.map(({ _id, content }) => ({
                label: content,
                value: _id,
              }))}
              value={parentId}
              onChange={(value) => handleChange({ parentId: value })}
            />
            <DatePicker
              minDate={dayjs().toDate()}
              closeDropdownOnScroll={false}
              placeholder="Deadline"
              size="xs"
              radius="xs"
              inputFormat="D MMM, YYYY"
              value={deadline ? dayjs(deadline).toDate() : null}
              onChange={(date) => {
                console.log(date);
                handleChange({ deadline: dayjs(date).endOf("day").toDate() });
              }}
            />
            <Checkbox
              size="xs"
              label={"Mark completed"}
              checked={marked}
              onChange={(e) =>
                handleChange({ marked: e.currentTarget.checked })
              }
            />
          </Fragment>
        )}
        {showClearButton && (
          <Button
            radius="xs"
            size="xs"
            variant="link"
            className="ml"
            onClick={clearFields}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="controls">
        <Input
          style={{ flex: "1 1 auto" }}
          radius="xs"
          size="xs"
          autoFocus
          value={content}
          onChange={(e) => handleChange({ content: e.currentTarget.value })}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${
            type === "TODO" ? "Todo" : "Topic/Feature/Group"
          }`}
        />
        {selectedTask?.mode === "EDIT" ? (
          <Button
            radius="xs"
            size="xs"
            disabled={appLoading}
            onClick={() => updateTask(selectedTask._id, data)}
          >
            Update
          </Button>
        ) : (
          <Button
            radius="xs"
            size="xs"
            disabled={appLoading || !content}
            onClick={addTask}
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddItem;
