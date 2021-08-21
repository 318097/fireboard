import React from "react";
import Auth from "../components/Auth";
import Settings from "../components/Settings";
import TimelinePreview from "../components/TimelinePreview";
import Todos from "../components/Todos";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "../constants";

const getActivePage = ({ activePage, ...rest }) => {
  switch (activePage) {
    case "TIMELINE":
      return <TimelinePreview {...rest} />;
    case "TODAY":
      return <Todos mode="VIEW" {...rest} />;
    case "SETTINGS":
      return <Settings {...rest} />;
    case "AUTH":
      return <Auth {...rest} />;
    case "HOME":
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
