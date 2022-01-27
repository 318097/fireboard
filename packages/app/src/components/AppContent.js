import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, { useEffect, useState, Fragment } from "react";
import "../App.scss";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  getDataFromStorage,
  customStorage,
  setDataInStorage,
} from "../lib/storage";
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
import { ActionIcon, Badge } from "@mantine/core";
import { FiX, FiHexagon } from "react-icons/fi";
// import Logo from "../assets/icons/logo.svg";

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
  // toggleState,
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
      handleError(error, { logout });
    }
  };

  const logout = () => {
    setKey(INITIAL_STATE);
    customStorage({
      action: "remove",
      key: config.LOCAL_PROJECT_KEY,
    });
    setAppLoading(false);
    setInitLoading(false);
    console.log("%c LOGOUT", "color: red;");
    tracker.track("LOGOUT");
    tracker.reset();
    history.push("/login");
  };

  const load = () => {
    getDataFromStorage(async (state) => {
      try {
        setKey(state);
        const { activePage, session } = state;

        const token = _.get(session, "token");
        if (!token) {
          // history.push("/login");
          setInitLoading(false);
          return;
        }
        setActiveProjectId();
        history.push(`/${activePage}`);
        await isAccountActive(token);
      } catch (error) {
        handleError(error);
      } finally {
        tracker.track("INIT", { path: state.activePage || "-" });
        setTimeout(() => setInitLoading(false), 500);
      }
    });
  };

  const save = () => {
    if (initLoading) return;
    const updatedSession = { ...(session || {}), isAuthenticated: false };
    const dataToSave = {
      session: updatedSession,
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
      <Card className="app-title" hover={false}>
        <div className={"fcc gap-8"}>
          {/* <Logo /> */}
          <div className="app-name">
            FIREBOARD
            {/* {_.map(config.APP_NAME, (character, idx) => (
              <div className={"character"} key={idx}>
                {character}
              </div>
            ))} */}
          </div>
        </div>
        <div className="fcc gap-8">
          <ActionIcon
            {...mantineDefaultProps}
            variant="hover"
            onClick={() => {
              tracker.track("NAVIGATION", { name: "about" });
              history.push("/about");
            }}
          >
            <FiHexagon />
          </ActionIcon>

          {/* {config.isExtension && (
            <ActionIcon
              {...mantineDefaultProps}
              variant="light"
              color="red"
              onClick={toggleState}
            >
              <FiX />
            </ActionIcon>
          )} */}
        </div>
      </Card>

      <Card className="app-content" hover={false}>
        <Header logout={logout} />
        {!initLoading && (
          <Routes
            logout={logout}
            appLoading={appLoading}
            setAppLoading={setAppLoading}
            setSession={setSession}
          />
        )}
        {(initLoading || appLoading) && (
          <Loading type="dot-loader" background="white" />
        )}
      </Card>

      <Card className="app-footer" hover={false}>
        <div className="fcc">
          <StatusBar />
        </div>
        {isAuthenticated && (
          <Badge
            className="badge project-name"
            variant="filled"
            radius={20}
            color="dark"
          >
            {projectLabel}
          </Badge>
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
