import moment from "moment";

const formatData = ({ topics, todos, today }) => {
  if (today)
    todos = todos.filter(
      (todo) => todo.marked && moment(todo.completedOn).isSame(moment(), "day")
    );
  let hasData = true;

  const result = topics.map((topic) => {
    let doneCount = 0;
    const filteredTodos = todos.filter((todo) => {
      if (todo.topicId !== topic._id) return false;

      if (todo.marked) doneCount++;
      return true;
    });
    if (!filteredTodos.length) hasData = false;
    return {
      ...topic,
      todos: filteredTodos,
      doneCount,
    };
  });
  return today && !hasData ? [] : result;
};

const getActiveProject = () => {
  let projectId;
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
