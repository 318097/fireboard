import React, { useState, useReducer, useEffect, useRef } from "react";
import "./App.scss";
import { Card, Icon, Button, Checkbox, Tag } from "@codedrops/react-ui";
import axios from "axios";
import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getDataFromStorage, setDataInStorage } from "./utils";
import { getActiveProject } from "./helpers";

import Todos from "./components/Todos";
import TimelinePreview from "./components/Todos/TimelinePreview";
import Settings from "./components/Settings";
import Auth from "./components/Auth";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const navItems = ({ isLoggedIn }) =>
  [
    { label: "DOT", visible: isLoggedIn },
    { label: "TODAY", visible: isLoggedIn },
    { label: "TIMELINE", visible: isLoggedIn },
    { label: "SETTINGS", visible: isLoggedIn },
    { label: "AUTH", visible: !isLoggedIn },
  ].filter(({ visible }) => visible);

const App = () => {
  const [showApp, setAppVisibility] = useState(config.IS_DEV);
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef();

  useEffect(() => {
    if (showApp) process("LOAD");
    window.onbeforeunload = () => {
      if (showApp) process("SAVE", stateRef.current);
    };
  }, []);

  useEffect(() => {
    validateProjectId();
  }, [state.activeProjectId, _.get(state, "session.dot")]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...data, isLoggedIn: true, token },
      });
    } catch (err) {
      logout();
      console.log("Error: isAccountActive(): ", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const setActiveProject = () => {
    const keys = getActiveProject();
    dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: keys.active });
  };

  const validateProjectId = () => {
    let valid = false;
    _.get(state, "session.dot", []).forEach(({ _id }) => {
      if (_id === _.get(state, "activeProjectId")) valid = true;
    });
    dispatch({ type: constants.SET_KEY, payload: { isProjectIdValid: valid } });
  };

  const setActivePage = (page) =>
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page,
    });

  const setAppLoading = (status) =>
    dispatch({
      type: constants.SET_LOADING,
      payload: status,
    });

  const logout = () => {
    dispatch({
      type: constants.SET_KEY,
      payload: { session: {} },
    });
    setActivePage("AUTH");
    setAppLoading(false);
    setLoading(false);
    setDataInStorage(undefined, initialState);
    console.log("%c LOGOUT: Setting initial state...", "color: red;");
  };

  const process = (action, newData) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(undefined, (state) => {
          // console.log("loaded:: state::-", state);
          dispatch({ type: constants.SET_KEY, state });

          setActiveProject();
          const { session } = state;
          const { token } = session || {};
          if (!token) {
            setActivePage("AUTH");
            setLoading(false);
          } else isAccountActive(token);
        });
      } else {
        // console.log("saved:: state::-", state);
        setDataInStorage(undefined, newData || state);
      }
    } catch (err) {
      console.log("Error: process(): ", err);
    }
  };

  const toggleState = (action) => () => {
    process(action);
    setAppVisibility((prev) => !prev);
  };

  const { appLoading } = state;

  return (
    <div className="react-ui">
      {showApp ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState("SAVE")}>
            <Icon type="cancel-2" />
          </span>
          <AppContent
            loading={loading}
            state={state}
            dispatch={dispatch}
            setActivePage={setActivePage}
            setAppLoading={setAppLoading}
            logout={logout}
          />
          {(loading || appLoading) && <div className="loader" />}
        </div>
      ) : (
        <span className="dot" onClick={toggleState("LOAD")}></span>
      )}
    </div>
  );
};

const AppContent = ({
  loading,
  state,
  dispatch,
  setActivePage,
  setAppLoading,
  logout,
}) => {
  const projectName = useRef();
  const {
    activePage,
    activeProjectId,
    pendingTasksOnly,
    session = {},
    isProjectIdValid,
  } = state;
  const { isLoggedIn } = session;

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { todos = [], topics = [] },
      } = await axios.get(`/dot/todos?projectId=${activeProjectId}`);
      dispatch({ type: constants.SET_TOPICS, payload: topics });
      dispatch({ type: constants.SET_TODOS, payload: todos });
    };

    if (activeProjectId) {
      const projects = _.get(session, "dot", []);
      projects.forEach(({ _id, name }) => {
        if (_id === activeProjectId) projectName.current = name;
      });
    }

    if (!activeProjectId || !isLoggedIn) return;
    fetchData();
  }, [activeProjectId, isLoggedIn]);

  const Controls = () => {
    switch (activePage) {
      case "DOT":
        return (
          <Checkbox
            style={{ margin: "0" }}
            label={"Pending Tasks"}
            value={pendingTasksOnly}
            onChange={(e, value) =>
              dispatch({
                type: constants.SET_KEY,
                payload: { pendingTasksOnly: value },
              })
            }
          />
        );
      case "SETTINGS":
        return (
          <Button className="btn" onClick={logout}>
            Logout
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <div className="header">
        <nav>
          {navItems({ isLoggedIn }).map(({ label }) => (
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
        <ActivePage
          state={state}
          dispatch={dispatch}
          activePage={activePage}
          setActivePage={setActivePage}
          setAppLoading={setAppLoading}
        />
      )}

      {isLoggedIn && (
        <Tag className="project-name">{`${
          !isProjectIdValid && activeProjectId
            ? "Invalid Project Id"
            : projectName.current
            ? projectName.current
            : "No active project"
        }`}</Tag>
      )}
    </Card>
  );
};

const ActivePage = ({ activePage, ...rest }) => {
  switch (activePage) {
    case "TIMELINE":
      return <TimelinePreview {...rest} />;
    case "TODAY":
      return <Todos mode="VIEW" {...rest} />;
    case "SETTINGS":
      return <Settings mode="VIEW" {...rest} />;
    case "AUTH":
      return <Auth {...rest} />;
    case "HOME":
    default:
      return <Todos mode="ADD" {...rest} />;
  }
};

export default App;
