import React, { useState, Fragment, useReducer, useEffect } from "react";
import "./App.scss";
import { Card, Icon } from "@codedrops/react-ui";
import axios from "axios";

import config from "./config";
import { constants, reducer, initialState } from "./components/Todos/state";
import { getData, setData, getSessionInfo } from "./utils.js";

import Todos from "./components/Todos";
import TimelinePreview from "./components/Todos/TimelinePreview";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
// import Nav from "./components/Nav";

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
  { label: "TODAY" },
  { label: "TIMELINE" },
  { label: "SETTINGS" },
  { label: "AUTH" },
];

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { appLoading, activePage, activeProjectId } = state;

  useEffect(() => {
    const setActiveProject = () => {
      let projectId;
      const nodes = document.getElementsByTagName("META");
      for (let i = 0; i < nodes.length; i++) {
        // console.log(nodes[i].title, nodes[i].content);
        if (nodes[i].title === "dot") {
          projectId = nodes[i].content;
          break;
        }
      }
      dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: projectId });
    };
    setActiveProject();

    // getData((data) => {
    //   const {
    //     todos = [],
    //     topics = [
    //       {
    //         id: "others",
    //         content: "Others",
    //         createdAt: new Date().toISOString(),
    //         todos: [],
    //       },
    //     ],
    //   } = data.dot || {};
    //   dispatch({ type: constants.SET_TODOS, payload: todos });
    //   dispatch({ type: constants.SET_TOPICS, payload: topics });
    // });
    // setTimeout(
    //   () => dispatch({ type: constants.SET_LOADING, payload: false }),
    //   200
    // );
  }, []);

  useEffect(() => {
    const isAccountActive = async () => {
      const { token } = await getSessionInfo();
      if (!token) return setLoading(false);
      try {
        axios.defaults.headers.common["authorization"] = token;
        const { data } = await axios.post(`/auth/account-status`);
        dispatch({ type: constants.SET_SESSION, payload: data });

        const {
          data: { todos = [], topics = [] },
        } = await axios.get(`/dot?projectId=${activeProjectId}`);
        dispatch({ type: constants.SET_TOPICS, payload: topics });
        dispatch({ type: constants.SET_TODOS, payload: todos });
      } catch (err) {
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    if (!activeProjectId) return;
    isAccountActive();
  }, [activeProjectId]);

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
    case "AUTH":
      return <Auth state={state} dispatch={dispatch} />;
    case "HOME":
    default:
      return <Todos mode="ADD" state={state} dispatch={dispatch} />;
  }
};

export default App;
