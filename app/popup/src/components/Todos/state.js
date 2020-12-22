const initialData = {
  content: "",
  itemType: "TODO",
  topic: "",
  marked: false,
};

export const initialState = {
  todos: [],
  topics: [],
  appLoading: false,
  editTodo: null,
  data: {
    ...initialData,
  },
  activePage: "SETTINGS",
  activeProjectId: null,
  pendingTasksOnly: false,
  isProjectIdValid: true,
};

export const constants = {
  SET_LOADING: "SET_LOADING",
  CLEAR: "CLEAR",
  SET_DATA: "SET_DATA",
  MARK_TODO: "MARK_TODO",
  SET_TODOS: "SET_TODOS",
  ADD_TODO: "ADD_TODO",
  SET_EDIT_TODO: "SET_EDIT_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  DELETE_TODO: "DELETE_TODO",
  SET_TOPICS: "SET_TOPICS",
  ADD_TOPIC: "ADD_TOPIC",
  UPDATE_TOPIC: "UPDATE_TOPIC",
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE",
  SET_SESSION: "SET_SESSION",
  SET_ACTIVE_PROJECT_ID: "SET_ACTIVE_PROJECT_ID",
  SET_KEY: "SET_KEY",
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
        editTodo: null,
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
        if (topicObj._id === newTodo.topicId)
          return {
            ...topicObj,
            todos: [...(topicObj.todos || []), newTodo._id],
          };
        return topicObj;
      });
      return {
        ...state,
        todos: [...todos, newTodo],
        topics: updatedTopics,
        data: { ...initialData },
      };
    }
    case constants.SET_EDIT_TODO: {
      const { todos } = state;
      const { _id } = action.payload;
      const matchedTodo = todos.find((item) => item._id === _id);
      return {
        ...state,
        editTodo: action.payload,
        data: { content: matchedTodo.content },
      };
    }
    case constants.UPDATE_TODO: {
      const { todos } = state;
      const { payload } = action;
      const updatedTodos = todos.map((item) =>
        item._id === payload._id ? payload : item
      );
      return {
        ...state,
        todos: updatedTodos,
        editTodo: null,
        data: { ...initialData },
      };
    }
    case constants.DELETE_TODO: {
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
        topics: [...state.topics, action.payload],
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
        editTodo: null,
        data: { ...initialData },
      };
    }
    case constants.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload,
      };
    case constants.SET_SESSION:
      const updatedSession = { ...state.session, ...action.payload };
      return {
        ...state,
        session: updatedSession,
      };
    case constants.SET_ACTIVE_PROJECT_ID:
      return {
        ...state,
        activeProjectId: action.payload,
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
