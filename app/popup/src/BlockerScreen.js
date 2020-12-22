import React from "react";

const BlockerScreen = ({
  state,
  message = "Select a project to continue..",
}) => {
  const { activeProjectId, isProjectIdValid } = state;

  return activeProjectId && isProjectIdValid ? null : (
    <div className="blocker-screen">{message}</div>
  );
};

export default BlockerScreen;
