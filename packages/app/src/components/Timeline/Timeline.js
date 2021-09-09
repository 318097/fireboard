import React, { useEffect, useRef, useState } from "react";
import handleError from "../../lib/errorHandling";
import { Timeline as TimelineComponent } from "@codedrops/react-ui";
import axios from "axios";
import markdown from "markdown-it";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData, formatDate } from "../../lib/helpers";
import { connect } from "react-redux";
import { setAppLoading } from "../../redux/actions";
import { Badge, Button } from "@mantine/core";
import { mantineDefaultProps } from "../../appConstants";

const md = markdown({
  breaks: true,
});

const Timeline = ({
  activeProjectId,
  topics,
  setAppLoading,
  isProjectIdValid,
}) => {
  const scrollRef = useRef();
  const [data, setData] = useState([]);
  const [disableDownload, setDisableDownload] = useState(false);
  const [filters, setFilters] = useState({
    projectId: activeProjectId,
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    getTimeline();
  }, [filters]);

  const getTimeline = async () => {
    try {
      if (!isProjectIdValid) return;

      setAppLoading(true);
      const {
        data: { timeline },
      } = await axios.get(`/fireboard/tasks/completed`, { params: filters });

      if (!timeline.length) setDisableDownload(true);

      const formattedData = timeline.map((todoGroup) => ({
        ...todoGroup,
        topics: formatData({ todos: todoGroup.todos, topics }),
      }));

      setData((prev) => [...prev, ...formattedData]);
      setAppLoading(false);
      // if (filters.page === 1) {
      //   const ref = scrollRef.current;
      //   if (ref) ref.scrollTop = ref.clientHeight;
      // }
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleScroll = () => {
    // if (scrollRef.current.scrollTop !== 0 || appLoading || disableDownload)
    //   return;
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const renderItem = (item) => {
    const { date, topics } = item;
    const dayDate = formatDate(date);

    return (
      <div key={date} className="timeline-card">
        <Badge {...mantineDefaultProps} className="badge">
          {dayDate}
        </Badge>
        {topics
          .filter((topic) => topic.todos.length)
          .map((topic) => {
            const { _id, content: title, todos = [] } = topic;
            const key = `${_id}_${date}`;

            return (
              <div key={key} className="mb">
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
    <section
      ref={scrollRef}
      // onScroll={handleScroll}
    >
      <BlockerScreen />
      <TimelineComponent items={data} renderItem={renderItem} />
      {!disableDownload && (
        <div className="fcc mb">
          <Button onClick={handleScroll} size={"small"}>
            Load
          </Button>
        </div>
      )}
    </section>
  );
};

const mapStateToProps = ({ activeProjectId, topics, isProjectIdValid }) => ({
  activeProjectId,
  topics,
  isProjectIdValid,
});

const mapDispatchToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
