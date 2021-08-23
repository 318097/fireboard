import React, { useEffect, useRef, useState } from "react";
import handleError from "../../lib/errorHandling";
import { Timeline } from "@codedrops/react-ui";
import axios from "axios";
import markdown from "markdown-it";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData } from "../../lib/helpers";
import { formatDate } from "@codedrops/lib";
import { connect } from "react-redux";
import { setAppLoading } from "../../redux/actions";

const md = markdown({
  breaks: true,
});

const TimelinePreview = ({
  activeProjectId,
  topics,
  appLoading,
  setAppLoading,
}) => {
  const scrollRef = useRef();
  const [data, setData] = useState([]);
  // const [appLoading, setAppLoading] = useState(false);
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
    try {
      setAppLoading(true);
      const {
        data: { todos },
      } = await axios.get(`/dot/tasks/completed`, { params: filters });

      if (!todos.length) setDisableDownload(true);

      const formattedData = todos.map((todoGroup) => ({
        ...todoGroup,
        topics: formatData({ todos: todoGroup.todos, topics }),
      }));

      setData((prev) => [...formattedData, ...prev]);
      setAppLoading(false);
      if (filters.page === 1) {
        const ref = scrollRef.current;
        if (ref) ref.scrollTop = ref.clientHeight;
      }
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current.scrollTop !== 0 || appLoading || disableDownload)
      return;

    setAppLoading(true);
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const renderItem = (item) => {
    const { _id: date, topics } = item;
    return (
      <div key={date} className="timeline-card">
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
                  }}
                >
                  {title}
                </h4>
                {todos.map(({ content, _id }, index) => (
                  <div key={_id} className="content-wrapper mb-4 ml">
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
    );
  };

  return (
    <section ref={scrollRef} onScroll={handleScroll}>
      <BlockerScreen />
      <Timeline items={data} renderItem={renderItem} />
    </section>
  );
};

const mapStateToProps = ({ activeProjectId, topics, appLoading }) => ({
  activeProjectId,
  topics,
  appLoading,
});

const mapDispatchToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimelinePreview);
