const initialData = {
  content: "",
  type: "TODO",
  parentId: null,
  marked: false,
  deadline: null,
};

export const initialState = {
  todos: [],
  topics: [],
  appLoading: false,
  selectedTask: null,
  data: {
    ...initialData,
  },
  activePage: "SETTINGS",
  activeProjectId: null,
  pendingTasksOnly: true,
  isProjectIdValid: true,
  itemVisibilityStatus: {},
};

export const constants = {
  SET_LOADING: "SET_LOADING",
  CLEAR: "CLEAR",
  SET_DATA: "SET_DATA",
  MARK_TODO: "MARK_TODO",
  SET_TODOS: "SET_TODOS",
  ADD_TODO: "ADD_TODO",
  SET_EDIT_TODO: "SET_EDIT_TODO",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  SET_TOPICS: "SET_TOPICS",
  ADD_TOPIC: "ADD_TOPIC",
  UPDATE_TOPIC: "UPDATE_TOPIC",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_SESSION: "SET_SESSION",
  SET_ACTIVE_PROJECT_ID: "SET_ACTIVE_PROJECT_ID",
  SET_KEY: "SET_KEY",
  UPDATE_TOPIC_SETTINGS: "UPDATE_TOPIC_SETTINGS",
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        appLoading: action.payload,
      };
    case constants.CLEAR:
      return {
        ...state,
        data: { ...initialData },
        selectedTask: null,
      };
    case constants.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case constants.MARK_TODO: {
      const { todos } = state;
      const { payload } = action;
      const updatedTodos = todos.map((todo) =>
        todo._id === payload._id ? payload : todo
      );
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case constants.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    case constants.ADD_TODO: {
      const { todos, topics = [] } = state;
      const newTodo = action.payload;

      const updatedTopics = topics.map((topicObj) => {
        if (topicObj._id === newTodo.parentId)
          return {
            ...topicObj,
            todos: [newTodo._id, ...(topicObj.todos || [])],
          };
        return topicObj;
      });
      return {
        ...state,
        todos: [...todos, newTodo],
        topics: updatedTopics,
        data: { ...state.data, content: "" },
      };
    }
    case constants.SET_EDIT_TODO: {
      const { todos } = state;
      const { _id } = action.payload;
      const matchedTodo = todos.find((item) => item._id === _id);
      const { marked, content, parentId, status } = matchedTodo;
      const item = {
        type: "TODO",
        parentId,
        marked,
        deadline: status?.deadline,
        content,
      };
      return {
        ...state,
        selectedTask: action.payload,
        data: item,
      };
    }
    case constants.UPDATE_TASK: {
      const { todos } = state;
      const { payload } = action;
      const updatedTodos = todos.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        todos: updatedTodos,
        selectedTask: null,
        data: { ...initialData },
      };
    }
    case constants.DELETE_TASK: {
      const { todos } = state;
      const updatedTodos = todos.filter((item) => item._id !== action.payload);
      return {
        ...state,
        todos: updatedTodos,
      };
    }
    case constants.SET_TOPICS:
      return {
        ...state,
        topics: action.payload,
      };
    case constants.ADD_TOPIC: {
      return {
        ...state,
        topics: [action.payload, ...state.topics],
        data: { ...initialData },
      };
    }
    case constants.UPDATE_TOPIC: {
      const { topics } = state;
      const { payload } = action;
      const updatedTopics = topics.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        topics: updatedTopics,
        selectedTask: null,
        data: { ...initialData },
      };
    }
    case constants.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload,
      };
    case constants.SET_SESSION: {
      const updatedSession = { ...state.session, ...action.payload };
      return {
        ...state,
        session: updatedSession,
      };
    }
    case constants.SET_ACTIVE_PROJECT_ID:
      return {
        ...state,
        activeProjectId: action.payload,
      };
    case constants.UPDATE_TOPIC_SETTINGS:
      return {
        ...state,
        itemVisibilityStatus: action.payload,
      };
    case constants.SET_KEY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
