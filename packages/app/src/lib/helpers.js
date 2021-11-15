import dayjs from "dayjs";
import _ from "lodash";
import config from "../config";

const formatDate = (date) => (date ? dayjs(date).format("DD MMM, YY") : "");

const formatData = ({
  topics = [],
  todos = [],
  today,
  pendingTasksOnly,
  isTimeline = false,
}) => {
  if (today) {
    const now = dayjs();
    todos = todos.filter(
      (todo) =>
        todo.marked && dayjs(todo.status?.completedOn).isSame(now, "day")
    );
  }

  return topics
    .filter((topic) => (isTimeline ? true : topic.visible))
    .map((topic) => {
      let doneCount = 0;
      const filteredTodos = todos.filter((todo) => {
        if (todo.parentId !== topic._id) return false;
        if (pendingTasksOnly && !today && todo.marked) return false;
        if (todo.marked) doneCount++;
        return true;
      });
      return {
        ...topic,
        todos: filteredTodos,
        doneCount,
      };
    })
    .filter((topic) =>
      today || pendingTasksOnly ? !_.isEmpty(topic.todos) : true
    );
};

const getActiveProject = () => {
  const keys = { storage: null, metaTag: null, active: null, activeKey: null };

  const nodes = document.getElementsByTagName("META");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].title === "fireboard:project-id") {
      const key = nodes[i].content;
      keys.metaTag = key;
      keys.active = key;
      keys.activeKey = "meta";
      break;
    }
  }

  let projectId = localStorage.getItem(config.LOCAL_PROJECT_KEY);
  if (projectId) {
    keys.storage = projectId;
    keys.active = projectId;
    keys.activeKey = "storage";
  }

  return keys;
};

export { formatData, getActiveProject, formatDate };
