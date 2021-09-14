import _ from "lodash";
import constants from "./constants";
import { getActiveProject } from "../lib/helpers";

const INITIAL_FORM_DATA = {
  content: "",
  type: "TODO",
  parentId: null,
  marked: false,
  deadline: null,
};

const INITIAL_STATE = {
  appLoading: false,
  todos: [],
  topics: [],
  selectedTask: null,
  data: INITIAL_FORM_DATA,
  activePage: null,
  activeProjectId: null,
  activeProjectName: null,
  pendingTasksOnly: true,
  isProjectIdValid: false,
  itemVisibilityStatus: [],
  selectedProjects: {},
  session: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        appLoading: action.payload,
      };
    case constants.CLEAR_FORM:
      return {
        ...state,
        data: INITIAL_FORM_DATA,
      };
    case constants.CANCEL_SELECTION:
      return {
        ...state,
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
    case constants.SET_TASK_FOR_EDIT: {
      const { todos, topics } = state;
      const { _id, type } = action.payload;
      const matchedItem = _.find(type === "TODO" ? todos : topics, { _id });
      const pickedItems = _.pick(
        matchedItem,
        type === "TODO" ? ["marked", "content", "parentId"] : ["content"]
      );
      const item = {
        ...pickedItems,
        type,
        deadline: matchedItem?.status?.deadline,
      };
      return {
        ...state,
        selectedTask: action.payload,
        data: item,
      };
    }
    case constants.SET_TASK_FOR_DELETE: {
      return {
        ...state,
        selectedTask: action.payload,
      };
    }
    case constants.UPDATE_TASK: {
      const { todos, topics } = state;
      const { payload } = action;
      return {
        ...state,
        todos: _.map(todos, (item) =>
          item._id === payload._id ? payload : item
        ),
        topics: _.map(topics, (item) =>
          item._id === payload._id ? payload : item
        ),
        selectedTask: null,
        data: INITIAL_FORM_DATA,
      };
    }
    case constants.DELETE_TASK: {
      const { todos, topics } = state;
      const { _id, type } = action.payload;
      return {
        ...state,
        selectedTask: null,
        todos:
          type === "TODO" ? _.filter(todos, (item) => item._id !== _id) : todos,
        topics:
          type === "TOPIC"
            ? _.filter(topics, (item) => item._id !== _id)
            : topics,
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
        data: INITIAL_FORM_DATA,
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
        data: INITIAL_FORM_DATA,
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
    case constants.SET_ACTIVE_PROJECT_ID: {
      const id = action.payload;
      const selectedProjects = getActiveProject();

      let activeProjectId = id;
      let activeProjectName,
        isProjectIdValid = false;

      if (!id) activeProjectId = selectedProjects.active;

      const projects = _.get(state, "session.fireboardProjects", []);
      projects.forEach(({ _id, name }) => {
        if (_id === activeProjectId) {
          activeProjectName = name;
          isProjectIdValid = true;
        }
      });

      return {
        ...state,
        activeProjectId,
        activeProjectName,
        isProjectIdValid: isProjectIdValid && activeProjectId,
        selectedProjects,
      };
    }
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

export { INITIAL_STATE };
export default reducer;
