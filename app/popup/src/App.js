import React, { useState, Fragment, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Icon } from "@codedrops/react-ui";
import axios from "axios";

import config from "./config";
import Todos from "./components/Todos";
// import Nav from "./components/Nav";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getData, setData } from "./utils.js";
import TimelinePreview from "./components/Todos/TimelinePreview";
import Settings from "./components/Settings";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const App = () => {
  const [state, setState] = useState(true);

  const toggleState = () => setState((prev) => !prev);

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

const navItems = [
  { label: "DOT" },
  { label: "TIMELINE" },
  { label: "TODAY" },
  { label: "SETTINGS" },
];

const AppContent = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, topics, loading, activePage } = state;

  useEffect(() => {
    const isAccountActive = async () => {
      await axios.get(`/auth/account-status`, {});
    };
    // const token = true;
    // if (token) {
    //   try {
    //     const {
    //       data: { dot, ...others },
    //     } = await axios.get(`/auth/account-status`, { token });
    //     // dispatch({ type: constants.SET_TOPICS, payload: dot });
    //     // dispatch({ type: constants.SET_SESSION, payload: others });
    //   } catch (err) {
    //   } finally {
    //     setTimeout(() => setInitialLoading(false), 300);
    //   }
    // } else setInitialLoading(false);

    isAccountActive();

    getData((data) => {
      const {
        todos = [],
        topics = [
          {
            id: "others",
            content: "Others",
            createdAt: new Date().toISOString(),
            todos: [],
          },
        ],
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

  const setActivePage = (page) =>
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page,
    });

  return (
    <Card>
      <div className="header">
        <nav>
          {navItems.map(({ label }) => (
            <span
              key={label}
              className={`nav-item ${
                activePage === label ? "active-page" : ""
              }`}
              onClick={() => setActivePage(label)}
            >
              {label}
            </span>
          ))}
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
    case "TODAY":
      return <Todos mode="VIEW" state={state} dispatch={dispatch} />;
    case "SETTINGS":
      return <Settings mode="VIEW" state={state} dispatch={dispatch} />;
    case "HOME":
    default:
      return <Todos mode="ADD" state={state} dispatch={dispatch} />;
  }
};

export default App;
