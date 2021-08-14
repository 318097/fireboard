import React from "react";
import { Button, Switch } from "@mantine/core";

const Controls = ({ activePage, pendingTasksOnly, setKey, logout }) => {
  switch (activePage) {
    case "DOT":
      return (
        <Switch
          // size="sm"
          label={"Pending"}
          checked={pendingTasksOnly}
          onChange={(e) =>
            setKey({ pendingTasksOnly: e.currentTarget.checked })
          }
        />
      );
    case "SETTINGS":
      return (
        <Button radius="xs" size="compact-xs" onClick={logout}>
          Logout
        </Button>
      );
    default:
      return null;
  }
};

export default Controls;
