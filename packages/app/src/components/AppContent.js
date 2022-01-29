import { Card, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { Divider } from "@mantine/core";
import Footer from "./Footer";
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
  addItemVisibilityStatus,
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
    addItemVisibilityStatus,
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
      addItemVisibilityStatus,
    };
    // console.log("saving:", dataToSave);
    setDataInStorage(dataToSave);
  };

  return (
    <Card className="app-content" hover={false}>
      <Header logout={logout} />
      {/* <div className="fcc gap-8">
       */}

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
      {/* </div> */}
      <Divider />
      <div className="sec">
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
      </div>
      <Divider />

      <Footer
        isAuthenticated={isAuthenticated}
        isProjectIdValid={isProjectIdValid}
        activeProjectName={activeProjectName}
        activeProjectId={activeProjectId}
      />
    </Card>
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
  addItemVisibilityStatus,
}) => ({
  activePage,
  activeProjectId,
  pendingTasksOnly,
  session,
  isProjectIdValid,
  appLoading,
  itemVisibilityStatus,
  activeProjectName,
  addItemVisibilityStatus,
});

const mapDispatchToProps = {
  setAppLoading,
  setSession,
  setKey,
  setActiveProjectId,
  fetchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContent);
