import { Card, Button, Checkbox, Tag, StatusBar } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "./lib/errorHandling";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import "./App.scss";
import Auth from "./components/Auth";
import Settings from "./components/Settings";
import TimelinePreview from "./components/TimelinePreview";
import Todos from "./components/Todos";
import { constants } from "./state";

const navItems = ({ isLoggedIn }) =>
  [
    { label: "DOT", visible: isLoggedIn },
    { label: "TODAY", visible: isLoggedIn },
    { label: "TIMELINE", visible: isLoggedIn },
    { label: "SETTINGS", visible: isLoggedIn },
    { label: "AUTH", visible: !isLoggedIn },
  ].filter(({ visible }) => visible);

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

const AppContent = ({
  initialLoad,
  state,
  dispatch,
  setActivePage,
  setLoading,
  logout,
  setActiveProject,
  setKey,
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
      try {
        setLoading(true);
        const {
          data: { todos = [], topics = [] },
        } = await axios.get(`/dot/tasks?projectId=${activeProjectId}`);
        dispatch({ type: constants.SET_TOPICS, payload: topics });
        dispatch({ type: constants.SET_TODOS, payload: todos });
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (activeProjectId) {
      const projects = _.get(session, "dotProjects", []);
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
            size="sm"
            label={"Pending"}
            value={pendingTasksOnly}
            onChange={(e, value) => setKey({ pendingTasksOnly: value })}
          />
        );
      case "SETTINGS":
        return (
          <Button
            className="ui-button"
            skipDefaultClass={true}
            size="sm"
            onClick={logout}
          >
            Logout
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="app-content" hover={false}>
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
      {!initialLoad && (
        <ActivePage
          state={state}
          dispatch={dispatch}
          activePage={activePage}
          setActivePage={setActivePage}
          setLoading={setLoading}
          setActiveProject={setActiveProject}
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
      <StatusBar />
    </Card>
  );
};

export default AppContent;
