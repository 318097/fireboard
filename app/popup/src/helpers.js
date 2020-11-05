import moment from "moment";

const formatData = ({ topics, todos, today }) => {
  if (today)
    todos = todos.filter(
      (todo) => todo.marked && moment(todo.completedOn).isSame(moment(), "day")
    );

  const result = topics.map((topic) => {
    let doneCount = 0;
    const filteredTodos = todos.filter((todo) => {
      if (todo.topicId !== topic._id) return false;

      if (todo.marked) doneCount++;
      return true;
    });
    return {
      ...topic,
      todos: filteredTodos,
      doneCount,
    };
  });
  return result;
};

export { formatData };
