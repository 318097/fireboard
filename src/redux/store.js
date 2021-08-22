import { configureStore } from "@reduxjs/toolkit";
import reducer, { INITIAL_STATE } from "./reducer";
import thunk from "redux-thunk";

export default configureStore({
  reducer,
  preloadedState: INITIAL_STATE,
  middleware: [thunk],
});
