import React, { Fragment } from "react";
import {
  Button,
  Checkbox,
  SegmentedControl,
  Select,
  Input,
} from "@mantine/core";
import dayjs from "dayjs";
import "./AddItem.scss";
import { addTask, clearForm, handleChange } from "../../redux/actions";
import { DatePicker } from "@mantine/dates";
import { connect } from "react-redux";
import { mantineDefaultProps } from "../../appConstants";

const AddItem = ({
  data,
  selectedTask,
  topics,
  appLoading,
  addTask,
  updateTask,
  clearForm,
  handleChange,
}) => {
  const { type, content, marked, deadline } = data || {};
  let { parentId } = data || {};

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      if (selectedTask?.mode === "EDIT") updateTask(selectedTask._id, data);
      else addTask();
    }
  };

  const showClearButton =
    type !== "TODO" || !!content || !!parentId || marked || deadline;

  return (
    <div className="add-container">
      <div className="options">
        <SegmentedControl
          {...mantineDefaultProps}
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
              {...mantineDefaultProps}
              placeholder="Topic"
              data={topics.map(({ _id, content }) => ({
                label: content,
                value: _id,
              }))}
              value={parentId}
              onChange={(value) => handleChange({ parentId: value })}
            />
            <DatePicker
              {...mantineDefaultProps}
              minDate={dayjs().toDate()}
              closeDropdownOnScroll={false}
              placeholder="Deadline"
              inputFormat="D MMM,YY"
              value={deadline ? dayjs(deadline).toDate() : null}
              onChange={(date) =>
                handleChange({ deadline: dayjs(date).endOf("day").toDate() })
              }
            />
            <Checkbox
              {...mantineDefaultProps}
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
            {...mantineDefaultProps}
            variant="link"
            className="ml"
            onClick={clearForm}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="controls">
        <Input
          style={{ flex: "1 1 auto" }}
          {...mantineDefaultProps}
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
            {...mantineDefaultProps}
            disabled={appLoading}
            onClick={() => updateTask(selectedTask._id, data)}
          >
            Update
          </Button>
        ) : (
          <Button
            {...mantineDefaultProps}
            disabled={appLoading || !content.trim()}
            onClick={addTask}
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ data, selectedTask, topics, appLoading }) => ({
  data,
  selectedTask,
  topics,
  appLoading,
});

const mapDispatchToProps = {
  addTask,
  clearForm,
  handleChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddItem);
