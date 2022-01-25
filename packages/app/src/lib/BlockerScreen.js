import React from "react";
import { BlockerScreen } from "@codedrops/react-ui";
import { connect } from "react-redux";
import _ from "lodash";

const DEFAULT_MESSAGE = "Select a project to access this page";

const BlockerScreenWrapper = ({ hasAccess, hasProjects, message }) => {
  message = message
    ? message
    : hasProjects
    ? DEFAULT_MESSAGE
    : 'Get started by creating a project from "Settings"';

  return <BlockerScreen hasAccess={hasAccess} message={message} />;
};

const mapStateToProps = ({ isProjectIdValid, session }) => ({
  hasAccess: isProjectIdValid,
  hasProjects: _.get(session, "fireboardProjects.length", 0) > 0,
});
export default connect(mapStateToProps)(BlockerScreenWrapper);
