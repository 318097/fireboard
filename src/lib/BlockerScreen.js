import { BlockerScreen } from "@codedrops/react-ui";
import React from "react";

const BlockerScreenWrapper = ({
  state,
  message = "Select a project to continue..",
}) => {
  const { activeProjectId, isProjectIdValid } = state;
  const hasAccess = activeProjectId && isProjectIdValid;
  return <BlockerScreen hasAccess={hasAccess} message={message} />;
};

export default BlockerScreenWrapper;