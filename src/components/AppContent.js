import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, { useEffect, useRef, useState, Fragment } from "react";
import "../App.scss";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { getDataFromStorage, setDataInStorage } from "../lib/storage";
import { getActiveProject } from "../lib/helpers";
import Header from "./Header";
import Routes from "./Routes";
import tracker from "../lib/mixpanel";
import {
  setSession,
  setKey,
  setActiveProjectId,
  setAppLoading,
  fetchData,
  validateProjectId,
} from "../redux/actions";
import { INITIAL_STATE } from "../redux/reducer";

const APP_NAME = "DEVBOARD".split("");

const AppContent = ({
  setSession,
  setKey,
  setActiveProjectId,
  setAppLoading,
  activePage,
  activeProjectId,
  pendingTasksOnly,
  session = {},
  isProjectIdValid,
  appLoading,
  itemVisibilityStatus,
  fetchData,
  validateProjectId,
}) => {
  const history = useHistory();
  const [initLoading, setInitLoading] = useState(true);
  const projectName = useRef();
  const { isAuthenticated } = session;

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    save();
  }, [
    session,
    pendingTasksOnly,
    activePage,
    activeProjectId,
    itemVisibilityStatus,
  ]);

  useEffect(() => {
    if (activeProjectId) {
      const projects = _.get(session, "dotProjects", []);
      projects.forEach(({ _id, name }) => {
        if (_id === activeProjectId) projectName.current = name;
      });
    }

    if (!activeProjectId || !isAuthenticated) return;
    fetchData();
  }, [activeProjectId, isAuthenticated]);

  useEffect(() => {
    validateProjectId();
  }, [activeProjectId, _.get(session, "dotProjects")]);

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      setSession({ ...data, isAuthenticated: true, token });
    } catch (error) {
      logout();
      handleError(error);
    } finally {
      setTimeout(() => setInitLoading(false), 500);
    }
  };

  const setActiveProject = () => {
    const keys = getActiveProject();
    setActiveProjectId(keys.active);
  };

  const logout = () => {
    setKey(INITIAL_STATE);
    setAppLoading(false);
    setInitLoading(false);
    console.log("%c LOGOUT: Setting initial state...", "color: red;");
    tracker.track("LOGOUT");
    tracker.reset();
    history.push("/auth");
  };

  const load = () => {
    getDataFromStorage((state) => {
      // console.log("loaded:", state);
      setKey(state);
      const { activePage, session } = state;

      const token = _.get(session, "token");
      if (!token) {
        history.push("/auth");
        setInitLoading(false);
        return;
      }
      setActiveProject();
      tracker.track("INIT", { path: activePage });
      history.push(`/${activePage}`);
      isAccountActive(token);
    });
  };

  const save = () => {
    if (initLoading) return;

    const dataToSave = {
      session,
      activeProjectId,
      activePage,
      pendingTasksOnly,
      itemVisibilityStatus,
    };
    // console.log("saving:", dataToSave);
    setDataInStorage(dataToSave);
  };

  const activeProjectName =
    !isProjectIdValid && activeProjectId
      ? "Invalid Project Id"
      : projectName.current
      ? projectName.current
      : "No active project";

  return (
    <Fragment>
      <Card className="app-content" hover={false}>
        <Header logout={logout} />
        {!initLoading && (
          <Routes
            setAppLoading={setAppLoading}
            setActiveProject={setActiveProject}
          />
        )}
        <div className="app-name">
          {_.map(APP_NAME, (character, idx) => (
            <div className={"character"} key={idx}>
              {character}
            </div>
          ))}
        </div>
        {isAuthenticated && (
          <Tag className="project-name">{activeProjectName}</Tag>
        )}
        <StatusBar />
      </Card>
      {(initLoading || appLoading) && <Loading type="dot-loader" />}
    </Fragment>
  );
};

const mapStateToProps = ({
  activePage,
  activeProjectId,
  pendingTasksOnly,
  session = {},
  isProjectIdValid,
  appLoading,
  itemVisibilityStatus,
}) => ({
  activePage,
  activeProjectId,
  pendingTasksOnly,
  session,
  isProjectIdValid,
  appLoading,
  itemVisibilityStatus,
});

const mapDispatchToProps = {
  setAppLoading,
  setSession,
  setKey,
  setActiveProjectId,
  fetchData,
  validateProjectId,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContent);
