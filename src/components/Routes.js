import React from "react";
import Auth from "../components/Auth";
import Settings from "../components/Settings";
import Timeline from "../components/Timeline";
import Topics from "../components/Topics";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../appConstants";

const getActivePage = ({ activePage }) => {
  switch (activePage) {
    case "timeline":
      return <Timeline />;
    case "today":
      return <Topics mode="VIEW" />;
    case "settings":
      return <Settings />;
    case "auth":
      return <Auth />;
    case "home":
      return <Topics mode="ADD" />;
  }
};

const Routes = () => (
  <Switch>
    {ROUTES().map(({ path, value }) => (
      <Route key={value} exact path={path}>
        {getActivePage({ activePage: value })}
      </Route>
    ))}
  </Switch>
);

export default Routes;
