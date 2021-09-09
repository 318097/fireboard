import React from "react";
import { BlockerScreen } from "@codedrops/react-ui";
import { connect } from "react-redux";

const BlockerScreenWrapper = ({
  hasAccess,
  message = "Select a project to access this page",
}) => {
  return <BlockerScreen hasAccess={hasAccess} message={message} />;
};

const mapStateToProps = ({ isProjectIdValid }) => ({
  hasAccess: isProjectIdValid,
});
export default connect(mapStateToProps)(BlockerScreenWrapper);
