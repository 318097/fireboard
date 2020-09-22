import React from "react";
import moment from "moment";
import { Timeline } from "@codedrops/react-ui";

const getCompletedOn = date => moment(date).format("DD MMM, YY");

const TimelinePreview = ({ state, dispatch }) => {
  const { todos, topics } = state;

  const renderItem = item => {
    const { content, id, completedOn } = item;
    return (
      <div key={id} className="left">
        <div className="card">
          <span>{getCompletedOn(completedOn)}</span>
          <span>{content}</span>
        </div>
      </div>
    );
  };

  return (
    <section>
      <Timeline
        items={todos.filter(todo => todo.marked)}
        renderItem={renderItem}
      />
    </section>
  );
};

export default TimelinePreview;
