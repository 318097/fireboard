import React, { useState, Fragment } from "react";
import "./App.scss";
import { Icon } from "@codedrops/react-ui";
import axios from "axios";
import AppContent from "./components/AppContent";
import classnames from "classnames";
import config from "./config";

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
    <div className="react-ui">
      {config.isApp ? (
        <div className={dotContainerClasses}>
          <AppContent />
        </div>
      ) : (
        <Fragment>
          {appVisibility ? (
            <div className={dotContainerClasses}>
              <span className="close-icon" onClick={toggleState}>
                <Icon type="cancel-2" />
              </span>
              <AppContent appVisibility={appVisibility} />
            </div>
          ) : (
            <span className="dot" onClick={toggleState}></span>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default App;
