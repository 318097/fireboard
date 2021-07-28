import React, { useState } from "react";
import "./App.scss";
import { Icon } from "@codedrops/react-ui";
import axios from "axios";

import AppContent from "./components/AppContent";
import config from "./config";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "DOT";

const App = () => {
  const [showApp, setAppVisibility] = useState(config.DEFAULT_STATE);

  const toggleState = () => {
    // process(action);
    setAppVisibility((prev) => !prev);
  };
  return (
    <div className="react-ui">
      {showApp ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState}>
            <Icon type="cancel-2" />
          </span>
          <AppContent showApp={showApp} />
        </div>
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </div>
  );
};

export default App;
