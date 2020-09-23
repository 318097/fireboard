import { v4 as uuid } from "uuid";

const initialData = {
  content: "",
  itemType: "TODO",
  topic: ""
};

export const initialState = {
  todos: [],
  topics: [],
  loading: true,
  editTodo: null,
  data: {
    ...initialData
  },
  activePage: "TODAY"
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
  SET_ACTIVE_PAGE: "SET_ACTIVE_PAGE"
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case constants.CLEAR:
      return {
        ...state,
        data: { ...initialData },
        editTodo: null
      };
    case constants.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...action.payload }
      };
    case constants.MARK_TODO: {
      const { todos } = state;
      const updatedTodos = todos.map(todo => {
        if (todo.id === action.payload)
          return {
            ...todo,
            marked: true,
            completedOn: new Date().toISOString()
          };

        return todo;
      });
      return {
        ...state,
        todos: updatedTodos
      };
    }
    case constants.SET_TODOS:
      return {
        ...state,
        todos: action.payload
      };
    case constants.ADD_TODO: {
      const {
        todos,
        topics = [],
        data: { content, topic }
      } = state;

      const newTodoId = uuid();
      const topicId = topic || "others";
      const updatedTodos = [
        ...todos,
        {
          id: newTodoId,
          content,
          createdAt: new Date().toISOString(),
          marked: false,
          topicId
        }
      ];
      const updatedTopics = topics.map(topicObj => {
        if (topicObj.id === topicId)
          return {
            ...topicObj,
            todos: [...(topicObj.todos || []), newTodoId]
          };

        return topicObj;
      });
      return {
        ...state,
        todos: updatedTodos,
        topics: updatedTopics,
        data: { ...initialData }
      };
    }
    case constants.SET_EDIT_TODO: {
      const { todos } = state;
      const { id } = action.payload;
      const matchedTodo = todos.find(item => item.id === id);
      return {
        ...state,
        editTodo: action.payload,
        data: { content: matchedTodo.content }
      };
    }
    case constants.UPDATE_TODO: {
      const {
        todos,
        editTodo,
        data: { content }
      } = state;
      const { id } = editTodo;
      const updatedTodos = todos.map(item => {
        if (item.id === id)
          return {
            ...item,
            content
          };
        return item;
      });
      return {
        ...state,
        todos: updatedTodos,
        editTodo: null,
        data: { ...initialData }
      };
    }
    case constants.DELETE_TODO: {
      const { todos } = state;
      const updatedTodos = todos.filter(item => item.id !== action.payload);
      return {
        ...state,
        todos: updatedTodos
      };
    }
    case constants.SET_TOPICS:
      return {
        ...state,
        topics: action.payload
      };
    case constants.ADD_TOPIC: {
      const {
        topics,
        data: { content }
      } = state;
      const updatedTopics = [
        ...topics,
        {
          id: uuid(),
          content,
          createdAt: new Date().toISOString(),
          todos: []
        }
      ];
      return {
        ...state,
        topics: updatedTopics,
        data: { ...initialData }
      };
    }
    case constants.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload
      };
    default:
      return state;
  }
};
