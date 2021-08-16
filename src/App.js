import React, { useState, Fragment } from "react";
import "./App.scss";
import axios from "axios";
import AppContent from "./components/AppContent";
import classnames from "classnames";
import config from "./config";
import { MantineProvider, ActionIcon } from "@mantine/core";
import { FiX } from "react-icons/fi";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const App = () => {
  const [appVisibility, setAppVisibility] = useState(config.DEFAULT_STATE);

  const toggleState = () => {
    // process(action);
    setAppVisibility((prev) => !prev);
  };

  const dotContainerClasses = classnames("dot-container", {
    extension: config.isExtension,
    application: config.isApp,
  });

  return (
    <MantineProvider
      theme={{ fontFamily: "Roboto Mono", primaryColor: "dark" }}
    >
      <div className="react-ui">
        {config.isApp ? (
          <div className={dotContainerClasses}>
            <AppContent />
          </div>
        ) : (
          <Fragment>
            {appVisibility ? (
              <div className={dotContainerClasses}>
                <ActionIcon
                  className="close-icon"
                  variant="filled"
                  size="xs"
                  color="red"
                  radius="sm"
                  onClick={toggleState}
                >
                  <FiX />
                </ActionIcon>
                <AppContent appVisibility={appVisibility} />
              </div>
            ) : (
              <span className="dot" onClick={toggleState}></span>
            )}
          </Fragment>
        )}
      </div>
    </MantineProvider>
  );
};

export default App;
