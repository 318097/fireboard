import React, { useState, Fragment, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Icon } from "@codedrops/react-ui";
import axios from "axios";

import config from "./config";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getData, setData, getSessionInfo } from "./utils";
import { getActiveProject } from "./helpers";

import Todos from "./components/Todos";
import TimelinePreview from "./components/Todos/TimelinePreview";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
// import Nav from "./components/Nav";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const App = () => {
  const [state, setState] = useState(true);
  const [showAppLoader, setShowAppLoader] = useState(true);
  const toggleState = () => setState((prev) => !prev);

  return (
    <div className="react-ui">
      {state ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState}>
            <Icon type="cancel-2" />
          </span>
          <AppContent setShowAppLoader={setShowAppLoader} />
          {showAppLoader && <Icon className="loader" type="triangle-2" />}
        </div>
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </div>
  );
};

const navItems = [
  { label: "DOT", isAuth: true },
  { label: "TODAY", isAuth: true },
  { label: "TIMELINE", isAuth: true },
  { label: "SETTINGS", isAuth: true },
  { label: "AUTH" },
];

const AppContent = ({ setShowAppLoader }) => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { appLoading, activePage, activeProjectId, pendingTasksOnly } = state;
  console.log(state);
  useEffect(() => {
    setShowAppLoader(loading || appLoading);
  }, [loading, appLoading]);

  useEffect(() => {
    const isAccountActive = async (token) => {
      try {
        axios.defaults.headers.common["authorization"] = token;

        const { data } = await axios.post(`/auth/account-status`);
        dispatch({ type: constants.SET_SESSION, payload: data });
        setActiveProject();
      } catch (err) {
        console.log(err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    getSessionInfo().then((session) => {
      dispatch({ type: constants.SET_SESSION, payload: session });
      const { token } = session;
      if (!token) return setLoading(false);
      isAccountActive(token);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { todos = [], topics = [] },
      } = await axios.get(`/dot?projectId=${activeProjectId}`);
      dispatch({ type: constants.SET_TOPICS, payload: topics });
      dispatch({ type: constants.SET_TODOS, payload: todos });
    };
    if (!activeProjectId) return;
    fetchData();
  }, [activeProjectId]);

  const setActivePage = (page) =>
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page,
    });

  const setActiveProject = () => {
    const projectId = getActiveProject();
    dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: projectId });
  };

  const Controls = () => {
    switch (activePage) {
      case "DOT":
        return (
          <div className="flex row center">
            <input
              type="checkbox"
              onChange={(e) =>
                dispatch({
                  type: constants.SET_KEY,
                  payload: { pendingTasksOnly: !pendingTasksOnly },
                })
              }
              checked={pendingTasksOnly}
            />
            Pending
          </div>
        );
      default:
        return null;
    }
  };

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
        <div className="extra-controls">
          <Controls />
        </div>
      </div>
      {!loading && (
        <ActivePage state={state} dispatch={dispatch} activePage={activePage} />
      )}
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
    case "AUTH":
      return <Auth state={state} dispatch={dispatch} />;
    case "HOME":
    default:
      return <Todos mode="ADD" state={state} dispatch={dispatch} />;
  }
};

export default App;
