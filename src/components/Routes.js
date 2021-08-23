import React from "react";
import Auth from "../components/Auth";
import Settings from "../components/Settings";
import TimelinePreview from "../components/TimelinePreview";
import Todos from "../components/Todos";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../appConstants";

const getActivePage = ({ activePage }) => {
  switch (activePage) {
    case "timeline":
      return <TimelinePreview />;
    case "today":
      return <Todos mode="VIEW" />;
    case "settings":
      return <Settings />;
    case "auth":
      return <Auth />;
    case "home":
      return <Todos mode="ADD" />;
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
