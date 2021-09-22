import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import "../App.scss";
import { useHistory, useLocation } from "react-router-dom";
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
import { mantineDefaultProps } from "../appConstants";
import { ActionIcon } from "@mantine/core";
import { FiX, FiHexagon } from "react-icons/fi";

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
  toggleState,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [initLoading, setInitLoading] = useState(true);
  const { isAuthenticated } = session;

  // console.log("location::-", location);

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
      <Card className="app-title__fb" hover={false}>
        <div className={"fcc gap-8"}>
          <div className="app-name__fb">
            {_.map(config.APP_NAME, (character, idx) => (
              <div className={"character__fb"} key={idx}>
                {character}
              </div>
            ))}
          </div>
        </div>
        <div className="fcc gap-8">
          <ActionIcon
            {...mantineDefaultProps}
            variant="hover"
            onClick={() => history.push("/about")}
          >
            <FiHexagon />
          </ActionIcon>

          {config.isExtension && (
            <ActionIcon
              {...mantineDefaultProps}
              variant="light"
              color="red"
              onClick={toggleState}
            >
              <FiX />
            </ActionIcon>
          )}
        </div>
      </Card>

      <Card className="app-content__fb" hover={false}>
        <Header logout={logout} />
        {!initLoading && <Routes />}
        {(initLoading || appLoading) && (
          <Loading type="dot-loader" background="white" />
        )}
      </Card>

      <Card className="app-footer__fb" hover={false}>
        <div className="fcc">
          <StatusBar />
        </div>
        {isAuthenticated && (
          <Tag className="project-name__fb">{projectLabel}</Tag>
        )}
      </Card>
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
