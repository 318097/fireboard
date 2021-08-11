import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "../lib/errorHandling";
import axios from "axios";
import React, {
  useEffect,
  useRef,
  useReducer,
  useState,
  Fragment,
} from "react";
import "../App.scss";
import Auth from "../components/Auth";
import Settings from "../components/Settings";
import TimelinePreview from "../components/TimelinePreview";
import Todos from "../components/Todos";
import { getDataFromStorage, setDataInStorage } from "../lib/storage";
import { getActiveProject } from "../lib/helpers";
import { constants, initialState, reducer } from "../state";
import Header from "./Header";
import tracker from "../lib/mixpanel";

const KEYS_TO_SAVE = [
  "session",
  "activeProjectId",
  "activePage",
  "pendingTasksOnly",
  "itemVisibilityStatus",
];

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

const AppContent = ({ appVisibility }) => {
  const [initLoading, setInitLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const projectName = useRef();
  const {
    activePage,
    activeProjectId,
    pendingTasksOnly,
    session = {},
    isProjectIdValid,
    appLoading,
    itemVisibilityStatus,
  } = state;
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
  }, [state.activeProjectId, _.get(state, "session.dotProjects")]);

  const fetchData = async () => {
    try {
      setAppLoading(true);
      const {
        data: { todos = [], topics = [] },
      } = await axios.get(`/dot/tasks?projectId=${activeProjectId}`);
      dispatch({ type: constants.SET_TOPICS, payload: topics });
      dispatch({ type: constants.SET_TODOS, payload: todos });
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...data, isAuthenticated: true, token },
      });
      // setActivePage("DOT");
    } catch (error) {
      logout();
      handleError(error);
    } finally {
      setTimeout(() => setInitLoading(false), 500);
    }
  };

  const setKey = (payload) => {
    dispatch({ type: constants.SET_KEY, payload });
  };

  const updateItemStatus = (payload) => {
    dispatch({ type: constants.UPDATE_TOPIC_SETTINGS, payload });
  };

  const setActiveProject = () => {
    const keys = getActiveProject();
    dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: keys.active });
  };

  const validateProjectId = () => {
    let valid = false;
    _.get(state, "session.dotProjects", []).forEach(({ _id }) => {
      if (_id === _.get(state, "activeProjectId")) valid = true;
    });
    setKey({ isProjectIdValid: valid });
  };

  const setActivePage = (page) => {
    tracker.track("NAVIGATION", { name: page });
    dispatch({
      type: constants.SET_ACTIVE_PAGE,
      payload: page,
    });
  };

  const setAppLoading = (status) =>
    dispatch({
      type: constants.SET_LOADING,
      payload: status,
    });

  const logout = () => {
    setKey({ session: {} });
    setAppLoading(false);
    setInitLoading(false);
    setDataInStorage(initialState);
    console.log("%c LOGOUT: Setting initial state...", "color: red;");
    tracker.track("LOGOUT");
    tracker.reset();
    setActivePage("AUTH");
  };

  const load = () => {
    getDataFromStorage((state) => {
      setKey(state);
      setActiveProject();
      tracker.track("INIT", { path: activePage });

      const token = _.get(state, "session.token");
      if (!token) {
        setActivePage("AUTH");
        setInitLoading(false);
      } else isAccountActive(token);
    });
  };

  const save = () => {
    if (initLoading || appLoading) return;
    const dataToSave = _.pick(state, KEYS_TO_SAVE);
    // console.log("saving:", dataToSave);
    setDataInStorage(dataToSave);
  };

  // console.log(state);

  const activeProjectName =
    !isProjectIdValid && activeProjectId
      ? "Invalid Project Id"
      : projectName.current
      ? projectName.current
      : "No active project";

  return (
    <Fragment>
      <Card className="app-content" hover={false}>
        <Header
          isAuthenticated={isAuthenticated}
          activePage={activePage}
          setActivePage={setActivePage}
          pendingTasksOnly={pendingTasksOnly}
          setKey={setKey}
          logout={logout}
        />
        {!initLoading && (
          <ActivePage
            state={state}
            dispatch={dispatch}
            activePage={activePage}
            setActivePage={setActivePage}
            setAppLoading={setAppLoading}
            setActiveProject={setActiveProject}
            updateItemStatus={updateItemStatus}
          />
        )}

        {isAuthenticated && (
          <Tag className="project-name">{activeProjectName}</Tag>
        )}
        <StatusBar />
      </Card>
      {(initLoading || appLoading) && <Loading type="dot-loader" />}
    </Fragment>
  );
};

export default AppContent;
