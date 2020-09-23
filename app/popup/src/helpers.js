const formatData = ({ topics, todos }) => {
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
