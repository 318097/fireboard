import React from "react";

const BlockerScreen = ({
  state,
  message = "Select a project to continue..",
}) => {
  const { activeProjectId } = state;

  return activeProjectId ? null : (
    <div className="blocker-screen">{message}</div>
  );
};

export default BlockerScreen;
