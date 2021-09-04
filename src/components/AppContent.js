import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import "../App.scss";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { getDataFromStorage, setDataInStorage } from "../lib/storage";
import Header from "./Header";
import Routes from "./Routes";
import tracker from "../lib/mixpanel";
import {
  setSession,
  setKey,
  setActiveProjectId,
  setAppLoading,
  fetchData,
} from "../redux/actions";
import { INITIAL_STATE } from "../redux/reducer";
import config from "../config";

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
  activeProjectName,
}) => {
  const history = useHistory();
  const [initLoading, setInitLoading] = useState(true);
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
    if (!activeProjectId || !isAuthenticated) return;
    fetchData();
  }, [activeProjectId, isAuthenticated]);

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      setSession({ ...data, isAuthenticated: true, token });
    } catch (error) {
      logout();
      handleError(error);
    }
  };

  const logout = () => {
    setKey(INITIAL_STATE);
    localStorage.removeItem(config.LOCAL_PROJECT_KEY);
    setAppLoading(false);
    setInitLoading(false);
    console.log("%c LOGOUT", "color: red;");
    tracker.track("LOGOUT");
    tracker.reset();
    history.push("/auth");
  };

  const load = () => {
    getDataFromStorage(async (state) => {
      try {
        setKey(state);
        const { activePage, session } = state;

        const token = _.get(session, "token");
        if (!token) {
          history.push("/auth");
          setInitLoading(false);
          return;
        }
        setActiveProjectId();
        tracker.track("INIT", { path: activePage });
        history.push(`/${activePage}`);
        await isAccountActive(token);
      } catch (error) {
        handleError(error);
      } finally {
        setTimeout(() => setInitLoading(false), 500);
      }
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

  const projectLabel = isProjectIdValid
    ? activeProjectName
    : activeProjectId
    ? "Invalid Project Id"
    : "No active project";

  return (
    <Fragment>
      <Card className="app-content" hover={false}>
        <Header logout={logout} />
        {!initLoading && <Routes />}
        <div className="app-name">
          {_.map(config.APP_NAME, (character, idx) => (
            <div className={"character"} key={idx}>
              {character}
            </div>
          ))}
        </div>
        {isAuthenticated && <Tag className="project-name">{projectLabel}</Tag>}
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
  activeProjectName,
}) => ({
  activePage,
  activeProjectId,
  pendingTasksOnly,
  session,
  isProjectIdValid,
  appLoading,
  itemVisibilityStatus,
  activeProjectName,
});

const mapDispatchToProps = {
  setAppLoading,
  setSession,
  setKey,
  setActiveProjectId,
  fetchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContent);
