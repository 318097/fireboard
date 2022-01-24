import dayjs from "dayjs";
import _ from "lodash";
import config from "../config";
import { customStorage } from "./storage";

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

const getActiveProject = async () => {
  const keys = { storage: null, metaTag: null, active: null, activeKey: null };

  const metaId = await customStorage({
    action: "meta",
    key: config.LOCAL_PROJECT_KEY,
  });

  if (metaId) {
    keys.metaTag = metaId;
    keys.active = metaId;
    keys.activeKey = "meta";
  }

  const storageId = await customStorage({
    action: "get",
    key: config.LOCAL_PROJECT_KEY,
  });

  if (storageId) {
    keys.storage = storageId;
    keys.active = storageId;
    keys.activeKey = "storage";
  }

  return keys;
};

export { formatData, getActiveProject, formatDate };
