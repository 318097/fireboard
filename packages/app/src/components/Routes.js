import React from "react";
import Settings from "../components/Settings";
import Timeline from "../components/Timeline";
import Topics from "../components/Topics";
import About from "../components/About";
import AuthSystem from "../components/AuthSystem";
import { Route, Switch, Redirect } from "react-router-dom";
import { ROUTES } from "../appConstants";

const getActivePage = ({
  activePage,
  logout,
  appLoading,
  setAppLoading,
  setSession,
}) => {
  switch (activePage) {
    case "about":
      return <About appId="FIREBOARD" />;
    case "home":
      return <Topics mode="ADD" />;
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
          action={activePage.toUpperCase()}
          logout={logout}
          appLoading={appLoading}
          setAppLoading={setAppLoading}
          setSession={setSession}
        />
      );
  }
};

const Routes = ({ logout, appLoading, setAppLoading, setSession }) => (
  <Switch>
    {ROUTES().map(({ value: activePage }) => (
      <Route key={activePage} exact path={`/${activePage}`}>
        {getActivePage({
          activePage,
          logout,
          appLoading,
          setAppLoading,
          setSession,
        })}
      </Route>
    ))}
    <Route exact path="/" render={() => <Redirect to="/login" />} />
  </Switch>
);

export default Routes;
