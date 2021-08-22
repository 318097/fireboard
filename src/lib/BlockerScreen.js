import { BlockerScreen } from "@codedrops/react-ui";
import React from "react";

const BlockerScreenWrapper = ({
  activeProjectId,
  isProjectIdValid,
  message = "Select a project to continue..",
}) => {
  const hasAccess = activeProjectId && isProjectIdValid;
  return <BlockerScreen hasAccess={hasAccess} message={message} />;
};

export default BlockerScreenWrapper;
