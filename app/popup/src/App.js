import React, { useState, Fragment, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Icon } from "@codedrops/react-ui";
import Todos from "./components/Todos";
// import Nav from "./components/Nav";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getData, setData } from "./utils.js";
import TimelinePreview from "./components/Todos/TimelinePreview/TimelinePreview";

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
          <AppContent />
        </div>
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </Fragment>
  );
};

const AppContent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, topics, loading, activePage } = state;

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

  const setActivePage = page =>
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page
    });

  return (
    <Card>
      {/* <Nav /> */}
      <div className="header">
        <nav>
          <span
            className={`nav-item ${activePage === "HOME" ? "active-page" : ""}`}
            onClick={() => setActivePage("HOME")}
          >
            DOT
          </span>
          <span
            className={`nav-item ${
              activePage === "TIMELINE" ? "active-page" : ""
            }`}
            onClick={() => setActivePage("TIMELINE")}
          >
            Timeline
          </span>
        </nav>
      </div>
      <ActivePage state={state} dispatch={dispatch} activePage={activePage} />
    </Card>
  );
};

const ActivePage = ({ activePage, state, dispatch }) => {
  switch (activePage) {
    case "TIMELINE":
      return <TimelinePreview state={state} dispatch={dispatch} />;
    case "HOME":
    default:
      return <Todos state={state} dispatch={dispatch} />;
  }
};

export default App;
