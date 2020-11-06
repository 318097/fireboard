import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Timeline } from "@codedrops/react-ui";
import { formatData } from "../../../helpers";
import axios from "axios";

const getCompletedOn = (date) => moment(date).format("DD MMM, YY");

const TimelinePreview = ({ state, dispatch }) => {
  const { activeProjectId, topics } = state;
  const scrollRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disableDownload, setDisableDownload] = useState(false);
  const [filters, setFilters] = useState({
    projectId: activeProjectId,
    page: 1,
    limit: 7,
  });

  useEffect(() => {
    getTimeline();
  }, [filters]);

  const getTimeline = async () => {
    const {
      data: { todos },
    } = await axios.get(`/dot/completed`, { params: filters });

    if (!todos.length) setDisableDownload(true);

    const formattedData = todos.map((todoGroup) => ({
      ...todoGroup,
      topics: formatData({ todos: todoGroup.todos, topics }),
    }));

    setData((prev) => [...formattedData, ...prev]);
    setLoading(false);
    if (filters.page === 1) {
      const ref = scrollRef.current;
      ref.scrollTop = ref.clientHeight;
    }
  };

  const handleScroll = () => {
    if (scrollRef.current.scrollTop !== 0 || loading || disableDownload) return;

    setLoading(true);
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const renderItem = (item) => {
    const { _id: date, topics } = item;
    return (
      <div key={date} className="left">
        <div className="card">
          <span>{getCompletedOn(date)}</span>
          {topics
            .filter((topic) => topic.todos.length)
            .map((topic) => {
              const { _id, content: title, todos = [] } = topic;
              return (
                <div key={_id} style={{ marginBottom: "4px" }}>
                  <h4 style={{ margin: "2px 0" }}>{title}</h4>
                  {todos.map(({ content, _id }) => (
                    <div key={_id}>{`- ${content}`}</div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <section ref={scrollRef} onScroll={handleScroll}>
      <Timeline items={data} renderItem={renderItem} />
    </section>
  );
};

export default TimelinePreview;
