import React, { useEffect, useState, useRef } from "react";
import { Timeline } from "@codedrops/react-ui";
import { formatData, formatDate } from "../../../helpers";
import axios from "axios";
import BlockerScreen from "../../../BlockerScreen";
import markdown from "markdown-it";

const md = markdown({
  breaks: true,
});

const TimelinePreview = ({ state, dispatch }) => {
  const { activeProjectId, topics } = state;
  const scrollRef = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disableDownload, setDisableDownload] = useState(false);
  const [filters, setFilters] = useState({
    projectId: activeProjectId,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    getTimeline();
  }, [filters]);

  const getTimeline = async () => {
    const {
      data: { todos },
    } = await axios.get(`/dot/todos/completed`, { params: filters });

    if (!todos.length) setDisableDownload(true);

    const formattedData = todos.map((todoGroup) => ({
      ...todoGroup,
      topics: formatData({ todos: todoGroup.todos, topics }),
    }));

    setData((prev) => [...formattedData, ...prev]);
    setLoading(false);
    if (filters.page === 1) {
      const ref = scrollRef.current;
      if (ref) ref.scrollTop = ref.clientHeight;
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
      <div key={date} className="timeline-left-container">
        <div className="timeline-card">
          <span>{formatDate(date)}</span>
          {topics
            .filter((topic) => topic.todos.length)
            .map((topic) => {
              const { _id, content: title, todos = [] } = topic;
              return (
                <div key={_id} className="mb">
                  <h4
                    style={{
                      margin: "4px 0 8px 0",
                      textDecoration: "underline",
                    }}
                  >
                    {title}
                  </h4>
                  {todos.map(({ content, _id }, index) => (
                    <div key={_id} className="content-wrapper mb ml">
                      <div className="content-index">{`${index + 1}. `}</div>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{
                          __html: md.renderInline(decodeURI(content)),
                        }}
                      />
                    </div>
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
      <BlockerScreen state={state} />
      <Timeline items={data} renderItem={renderItem} />
    </section>
  );
};

export default TimelinePreview;
