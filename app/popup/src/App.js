import React, { useState, useReducer, useEffect, useRef } from "react";
import "./App.scss";
import { Icon, Loading } from "@codedrops/react-ui";
import axios from "axios";
import _ from "lodash";
import config from "./config";
import { constants, reducer, initialState } from "./state";
import { getDataFromStorage, setDataInStorage } from "./lib/chromeExtension";
import { getActiveProject } from "./lib/helpers";
import AppContent from "./AppContent";
import { handleError } from "@codedrops/lib";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const App = () => {
  const [showApp, setAppVisibility] = useState(config.DEFAULT_STATE);
  const [initialLoad, setInitialLoad] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef();

  useEffect(() => {
    if (showApp) process("LOAD");
    window.onbeforeunload = () => {
      console.log("before unload..");
      if (showApp) process("SAVE", stateRef.current);
    };
  }, []);

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
        payload: { ...data, isLoggedIn: true, token },
      });
      setActivePage("DOT");
    } catch (error) {
      logout();
      handleError(error);
    } finally {
      setTimeout(() => setInitialLoad(false), 500);
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

  const setLoading = (status) =>
    dispatch({
      type: constants.SET_LOADING,
      payload: status,
    });

  const logout = () => {
    setKey({ session: {} });
    setActivePage("AUTH");
    setLoading(false);
    setInitialLoad(false);
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
            setInitialLoad(false);
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

  const toggleState = (action) => () => {
    process(action);
    setAppVisibility((prev) => !prev);
  };

  const { loading } = state;

  return (
    <div className="react-ui">
      {showApp ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState("SAVE")}>
            <Icon type="cancel-2" />
          </span>
          <AppContent
            initialLoad={initialLoad}
            state={state}
            dispatch={dispatch}
            setActivePage={setActivePage}
            setLoading={setLoading}
            logout={logout}
            setActiveProject={setActiveProject}
            setKey={setKey}
          />
          {(initialLoad || loading) && <Loading type="dot-loader" />}
        </div>
      ) : (
        <span className="dot" onClick={toggleState("LOAD")}></span>
      )}
    </div>
  );
};

export default App;
