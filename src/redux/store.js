import { configureStore } from "@reduxjs/toolkit";
import reducer, { initialState } from "./reducer";
import thunk from "redux-thunk";

export default configureStore({
  reducer,
  preloadedState: initialState,
  middleware: [thunk],
});
