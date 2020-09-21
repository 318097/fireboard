import React, { useState, Fragment, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Icon } from "@codedrops/react-ui";
import Todos from "./components/Todos";
// import Nav from "./components/Nav";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getData, setData } from "./utils.js";

const App = () => {
  const [state, setState] = useState(true);

  const toggleState = () => setState(prev => !prev);

  return (
    <Fragment>
      {state ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState}>
            <Icon type="cancel-2" />
          </span>
          <AppContent toggleState={toggleState} />
        </div>
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </Fragment>
  );
};

const AppContent = ({ toggleState }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, topics, loading } = state;

  useEffect(() => {
    getData(data => {
      const {
        todos = [],
        topics = [
          {
            id: "others",
            content: "Others",
            createdAt: new Date().toISOString(),
            todos: []
          }
        ]
      } = data.dot || {};
      dispatch({ type: constants.SET_TODOS, payload: todos });
      dispatch({ type: constants.SET_TOPICS, payload: topics });
    });
    setTimeout(
      () => dispatch({ type: constants.SET_LOADING, payload: false }),
      200
    );
  }, []);

  useEffect(() => {
    if (!loading) setData({ todos, topics });
  }, [todos, topics]);

  return (
    <Card>
      {/* <Nav /> */}
      <div className="header">
        <span className="flex">
          <span>DOT</span>
        </span>
        <span>Total: {todos.length}</span>
      </div>

      <Todos toggleState={toggleState} state={state} dispatch={dispatch} />
    </Card>
  );
};

export default App;
