import { v4 as uuid } from "uuid";

export const initialState = {
  todos: [],
  loading: true,
  content: "",
  editTodo: null
};

export const constants = {
  SET_TODOS: "SET_TODOS",
  SET_LOADING: "SET_LOADING",
  DELETE_TODO: "DELETE_TODO",
  MARK_TODO: "MARK_TODO",
  CLEAR: "CLEAR",
  SET_EDIT_TODO: "SET_EDIT_TODO",
  SET_CONTENT: "SET_CONTENT",
  ADD_TODO: "ADD_TODO",
  UPDATE_TODO: "UPDATE_TODO"
};

export const reducer = (state, action) => {
  switch (action.type) {
    case constants.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
        loading: false
      };
    case constants.ADD_TODO: {
      const { todos, content } = state;
      const updatedTodos = [
        ...todos,
        {
          id: uuid(),
          content,
          createdAt: new Date().toISOString(),
          marked: false
        }
      ];
      return {
        ...state,
        todos: updatedTodos,
        content: ""
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

    case constants.UPDATE_TODO: {
      const { todos, editTodo, content } = state;
      const { id } = editTodo;
      const updatedTodos = todos.map(item => {
        if (item.id === id) {
          return {
            ...item,
            content
          };
        }
        return item;
      });
      return {
        ...state,
        todos: updatedTodos,
        editTodo: null,
        content: ""
      };
    }
    case constants.MARK_TODO: {
      const { todos } = state;
      const updatedTodos = todos.map(todo => {
        if (todo.id === action.payload)
          return {
            ...todo,
            marked: true
          };

        return todo;
      });
      return {
        ...state,
        todos: updatedTodos
      };
    }
    case constants.CLEAR:
      return {
        ...state,
        content: "",
        editTodo: null
      };
    case constants.SET_CONTENT:
      return {
        ...state,
        content: action.payload
      };
    case constants.SET_EDIT_TODO: {
      const { todos } = state;
      const { id } = action.payload;
      const matchedTodo = todos.find(item => item.id === id);
      return {
        ...state,
        editTodo: action.payload,
        content: matchedTodo.content
      };
    }
    case constants.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};
