import React from "react";
import Settings from "../components/Settings";
import Timeline from "../components/Timeline";
import Topics from "../components/Topics";
import About from "../components/About";
import AuthSystem from "../components/AuthSystem";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../appConstants";

const getActivePage = ({
  activePage,
  logout,
  appLoading,
  setAppLoading,
  setSession,
}) => {
  switch (activePage) {
    case "timeline":
      return <Timeline />;
    case "today":
      return <Topics mode="VIEW" />;
    case "settings":
      return <Settings />;
    case "forgot-password":
    case "reset-password":
    case "change-password":
    case "verify-account":
    case "login":
    case "register":
      return (
        <AuthSystem
          action={activePage.toUpperCase().replace("-", "_")}
          logout={logout}
          appLoading={appLoading}
          setAppLoading={setAppLoading}
          setSession={setSession}
        />
      );
    case "about":
      return <About appId="FIREBOARD" />;
    case "home":
      return <Topics mode="ADD" />;
  }
};

const Routes = ({ logout, appLoading, setAppLoading, setSession }) => (
  <Switch>
    {ROUTES().map(({ path, value }) => (
      <Route key={value} exact path={path}>
        {getActivePage({
          activePage: value,
          logout,
          appLoading,
          setAppLoading,
          setSession,
        })}
      </Route>
    ))}
  </Switch>
);

export default Routes;
