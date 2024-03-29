import React, { useEffect, useRef, useState, Fragment } from "react";
import handleError from "../../lib/errorHandling";
import "./Timeline.scss";
import axios from "axios";
import markdown from "markdown-it";
import BlockerScreen from "../../lib/BlockerScreen";
import { formatData, formatDate } from "../../lib/helpers";
import { connect } from "react-redux";
import { setAppLoading } from "../../redux/actions";
import { Badge, Button, Timeline as MantineTimeline } from "@mantine/core";
import { mantineDefaultProps } from "../../appConstants";
import tracker from "../../lib/mixpanel";

const md = markdown({
  breaks: true,
});

const Timeline = ({
  activeProjectId,
  topics,
  setAppLoading,
  isProjectIdValid,
  appLoading,
}) => {
  const scrollRef = useRef();
  const [data, setData] = useState([]);
  const [hasNext, setHasNext] = useState(false);
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
        data: { timeline, next },
      } = await axios.get(`/fireboard/tasks/completed`, { params: filters });

      const formattedData = timeline.map((todoGroup) => ({
        ...todoGroup,
        topics: formatData({
          todos: todoGroup.todos,
          topics,
          isTimeline: true,
        }),
      }));

      setData((prev) => [...prev, ...formattedData]);
      setHasNext(next);
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

  const loadMore = () => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const renderItem = (item) => {
    const { date, topics } = item;
    const dayDate = formatDate(date);

    return (
      <MantineTimeline.Item
        key={date}
        title={
          <Badge
            {...mantineDefaultProps}
            className="badge"
            variant="filled"
            radius={2}
          >
            {dayDate}
          </Badge>
        }
      >
        <div className="timeline-card">
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
                    <div
                      key={_id}
                      className="content-wrapper mb-4 ml"
                      style={{ display: "flex", alignItems: "flex-start" }}
                    >
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
      </MantineTimeline.Item>
    );
  };

  return (
    <section ref={scrollRef} id="timeline">
      <BlockerScreen />
      {data.length ? (
        <Fragment>
          <MantineTimeline lineWidth={2} bulletSize={12} radius={20}>
            {data.map(renderItem)}
          </MantineTimeline>
          <div className="controls">
            {hasNext ? (
              <Button
                {...mantineDefaultProps}
                variant="light"
                onClick={loadMore}
                size={"xs"}
              >
                Load
              </Button>
            ) : appLoading ? null : (
              <Badge
                {...mantineDefaultProps}
                variant="outline"
                size="md"
                radius={12}
              >
                - End -
              </Badge>
            )}
          </div>
        </Fragment>
      ) : (
        <div className="empty-message">Empty</div>
      )}
    </section>
  );
};

const mapStateToProps = ({
  activeProjectId,
  topics,
  isProjectIdValid,
  appLoading,
}) => ({
  activeProjectId,
  topics,
  isProjectIdValid,
  appLoading,
});

const mapDispatchToProps = {
  setAppLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
