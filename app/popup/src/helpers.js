import moment from "moment";

const formatData = ({ topics, todos, marked, today }) => {
  if (marked) todos = todos.filter(todo => todo.marked);

  if (today)
    todos = todos.filter(
      todo => todo.marked && moment(todo.completedOn).isSame(moment(), "day")
    );

  return topics.map(topic => {
    let doneCount = 0;
    const todoList = todos.filter(todo => {
      if (todo.topicId !== topic.id) return false;

      if (todo.marked) doneCount++;
      return true;
    });
    return {
      ...topic,
      todos: todoList,
      doneCount
    };
  });
};

export { formatData };
