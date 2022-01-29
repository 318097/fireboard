import React from "react";
import { StatusBar } from "@codedrops/react-ui";
import { ActionIcon, Badge } from "@mantine/core";
import { FiHexagon } from "react-icons/fi";
import { mantineDefaultProps } from "../../appConstants";
import tracker from "../../lib/mixpanel";

const Footer = ({
  isAuthenticated,
  isProjectIdValid,
  activeProjectName,
  activeProjectId,
}) => {
  const projectLabel = isProjectIdValid
    ? activeProjectName
    : activeProjectId
    ? "Invalid Project Id"
    : "No active project";

  const projectColor = isProjectIdValid
    ? "green"
    : activeProjectName
    ? "red"
    : "orange";

  return (
    <footer>
      <div className="fcc gap">
        <StatusBar />
      </div>
      <div className="fcc gap">
        {isAuthenticated && (
          <Badge
            className="badge project-name"
            radius={2}
            size="sm"
            color={projectColor}
          >
            {projectLabel}
          </Badge>
        )}
        <ActionIcon
          {...mantineDefaultProps}
          variant="light"
          onClick={() => {
            tracker.track("NAVIGATION", { name: "about" });
            history.push("/about");
          }}
        >
          <FiHexagon />
        </ActionIcon>
      </div>
    </footer>
  );
};

export default Footer;
