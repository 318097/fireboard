import { Card, Tag, StatusBar, Loading } from "@codedrops/react-ui";
import _ from "lodash";
import handleError from "./lib/errorHandling";
import axios from "axios";
import React, {
  useEffect,
  useRef,
  useReducer,
  useState,
  Fragment,
} from "react";
import "./App.scss";
import Auth from "./components/Auth";
import Settings from "./components/Settings";
import TimelinePreview from "./components/TimelinePreview";
import Todos from "./components/Todos";
import { getDataFromStorage, setDataInStorage } from "./lib/chromeExtension";
import { getActiveProject } from "./lib/helpers";
import { constants, initialState, reducer } from "./state";
import Controls from "./Controls";

const navItems = ({ isAuthenticated }) =>
  [
    { label: "Dot", value: "DOT", visible: isAuthenticated },
    { label: "Today", value: "TODAY", visible: isAuthenticated },
    { label: "Timeline", value: "TIMELINE", visible: isAuthenticated },
    { label: "Settings", value: "SETTINGS", visible: isAuthenticated },
    { label: "Auth", value: "AUTH", visible: !isAuthenticated },
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

const AppContent = ({ showApp }) => {
  const [initLoading, setInitLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef();
  const projectName = useRef();
  const {
    activePage,
    activeProjectId,
    pendingTasksOnly,
    session = {},
    isProjectIdValid,
    appLoading,
  } = state;
  const { isAuthenticated } = session;

  useEffect(() => {
    if (showApp) process("LOAD");
    // window.onbeforeunload = () => {
    //   console.log("before unload..");
    //   if (showApp) process("SAVE", stateRef.current);
    // };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const isAccountActive = async (token) => {
    try {
      axios.defaults.headers.common["authorization"] = token;

      const { data } = await axios.post(`/auth/account-status`);
      dispatch({
        type: constants.SET_SESSION,
        payload: { ...data, isAuthenticated: true, token },
      });
      setActivePage("DOT");
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
    setKey({ session: {} });
    setActivePage("AUTH");
    setAppLoading(false);
    setInitLoading(false);
    setDataInStorage(undefined, initialState);
    console.log("%c LOGOUT: Setting initial state...", "color: red;");
  };

  const process = (action, newData) => {
    try {
      if (action === "LOAD") {
        getDataFromStorage(undefined, (state) => {
          // console.log("loaded:: state::-", state);
          setKey(state);

          setActiveProject();
          const { session } = state;
          const { token } = session || {};
          if (!token) {
            setActivePage("AUTH");
            setInitLoading(false);
          } else isAccountActive(token);
        });
      } else {
        const dataToSave = newData || state;
        dataToSave.todos = [];
        dataToSave.topics = [];
        setDataInStorage(undefined, dataToSave);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Fragment>
      <Card className="app-content" hover={false}>
        <div className="header">
          <nav>
            {navItems({ isAuthenticated }).map(({ label, value }) => (
              <span
                key={value}
                className={`nav-item ${
                  activePage === value ? "active-page" : ""
                }`}
                onClick={() => setActivePage(value)}
              >
                {label}
              </span>
            ))}
          </nav>
          <div className="extra-controls">
            <Controls
              activePage={activePage}
              pendingTasksOnly={pendingTasksOnly}
              setKey={setKey}
              logout={logout}
            />
          </div>
        </div>
        {!initLoading && (
          <ActivePage
            state={state}
            dispatch={dispatch}
            activePage={activePage}
            setActivePage={setActivePage}
            setAppLoading={setAppLoading}
            setActiveProject={setActiveProject}
          />
        )}

        {isAuthenticated && (
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
      {(initLoading || appLoading) && <Loading type="dot-loader" />}
    </Fragment>
  );
};

export default AppContent;
