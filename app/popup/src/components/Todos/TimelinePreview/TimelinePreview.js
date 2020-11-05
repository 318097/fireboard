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
  const [filters, setFilters] = useState({
    projectId: activeProjectId,
    page: 1,
    limit: 15,
  });

  useEffect(() => {
    getTimeline();
  }, [filters]);

  const getTimeline = async () => {
    const {
      data: { todos },
    } = await axios.get(`/dot/completed`, { params: filters });
    setData(todos);
    if (filters.page === 1) {
      const ref = scrollRef.current;
      ref.scrollTop = ref.clientHeight;
    } else {
      setData((prev) => [...todos, ...prev]);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    if (scrollRef.current.scrollTop !== 0 || loading) return;

    setLoading(true);
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const renderItem = (item) => {
    const { _id: date, todos } = item;
    const formattedData = formatData({ todos, topics });
    return (
      <div key={date} className="left">
        <div className="card">
          <span>{getCompletedOn(date)}</span>
          {formattedData
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
    // <section ref={scrollRef} onScroll={handleScroll}>
    <section ref={scrollRef}>
      <Timeline items={data} renderItem={renderItem} />
    </section>
  );
};

export default TimelinePreview;
