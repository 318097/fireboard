import moment from "moment";
import config from "./config";

const formatData = ({ topics, todos, today, pendingTasksOnly }) => {
  if (today)
    todos = todos.filter(
      (todo) =>
        todo.marked &&
        todo.completedOn &&
        moment(todo.completedOn).isSame(moment(), "day")
    );
  let hasData = false;

  const result = topics.map((topic) => {
    let doneCount = 0;
    const filteredTodos = todos.filter((todo) => {
      if (todo.topicId !== topic._id) return false;
      if (pendingTasksOnly && todo.marked) return false;
      if (todo.marked) doneCount++;
      return true;
    });
    if (filteredTodos.length) hasData = true;
    return {
      ...topic,
      todos: filteredTodos,
      doneCount,
    };
  });
  return today && !hasData ? [] : result;
};

const getActiveProject = () => {
  let projectId = localStorage.getItem(config.LOCAL_PROJECT_KEY);

  if (projectId) return projectId;

  const nodes = document.getElementsByTagName("META");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].title === "dot") {
      projectId = nodes[i].content;
      break;
    }
  }

  return projectId;
};

export { formatData, getActiveProject };
