import React from "react";
import moment from "moment";
import { Timeline } from "@codedrops/react-ui";
import { formatData } from "../../../helpers";

const getCompletedOn = (date) => moment(date).format("DD MMM, YY");

const TimelinePreview = ({ state, dispatch }) => {
  const { todos, topics } = state;

  const data = formatData({ todos, topics, today: true });

  const renderItem = (item) => {
    const { content: title, _id, todos } = item;
    return (
      <div key={_id} className="left">
        <div className="card">
          {/* <span>{getCompletedOn(completedOn)}</span> */}
          <h4>{title}</h4>
          {todos.map(({ content, _id }) => (
            <span key={_id}>{content}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section>
      <Timeline items={data} renderItem={renderItem} />
    </section>
  );
};

export default TimelinePreview;
