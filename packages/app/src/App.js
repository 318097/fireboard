import React, { useState, Fragment } from "react";
import "./App.scss";
import axios from "axios";
import AppContent from "./components/AppContent";
import classnames from "classnames";
import config from "./config";
import { MantineProvider } from "@mantine/core";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { MemoryRouter, BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["external-source"] = "FIREBOARD";

Sentry.init({
  environment: config.NODE_ENV,
  dsn: config.SENTRY_URL,
  integrations: [new Integrations.BrowserTracing()],
  // release: config.SENTRY_RELEASE,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const MANTINE_THEME = {
  fontFamily: "Roboto Mono",
  primaryColor: "dark",
  radius: "xs",
  padding: "xs",
  shadow: "xs",
};

const Router = config.isApp ? BrowserRouter : MemoryRouter;

const AppWrapper = () => (
  <Provider store={store}>
    <Router>
      <MantineProvider theme={MANTINE_THEME}>
        <Sentry.ErrorBoundary fallback={"An error has occurred"}>
          <App />
        </Sentry.ErrorBoundary>
      </MantineProvider>
    </Router>
  </Provider>
);

const App = () => {
  // const [appVisibility, setAppVisibility] = useState(config.DEFAULT_STATE);

  // const toggleState = () => {
  //   // process(action);
  //   setAppVisibility((prev) => !prev);
  // };

  const fireboardContainerClasses = classnames("fireboard-container__fb", {
    extension__fb: config.isExtension,
    application__fb: config.isApp,
  });

  return (
    <div className="react-ui" style={{ height: "100%" }}>
      {/* {config.isApp ? ( */}
      <div className={fireboardContainerClasses}>
        <AppContent />
      </div>
      {/* ) : (
        <Fragment>
          {appVisibility ? (
            <div className={fireboardContainerClasses}>
              <AppContent toggleState={toggleState} />
            </div>
          ) : (
            <span className="dot" onClick={toggleState}></span>
          )}
        </Fragment>
      )} */}
    </div>
  );
};

export default AppWrapper;
