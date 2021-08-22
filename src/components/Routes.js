import React from "react";
import Auth from "../components/Auth";
import Settings from "../components/Settings";
import TimelinePreview from "../components/TimelinePreview";
import Todos from "../components/Todos";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../appConstants";

const getActivePage = ({ activePage, ...rest }) => {
  switch (activePage) {
    case "timeline":
      return <TimelinePreview {...rest} />;
    case "today":
      return <Todos mode="VIEW" {...rest} />;
    case "settings":
      return <Settings {...rest} />;
    case "auth":
      return <Auth {...rest} />;
    case "home":
      return <Todos mode="ADD" {...rest} />;
  }
};

const Routes = (props) => {
  return (
    <Switch>
      {ROUTES().map(({ path, value }) => (
        <Route key={value} exact path={path}>
          {getActivePage({ ...props, activePage: value })}
        </Route>
      ))}
    </Switch>
  );
};

export default Routes;
