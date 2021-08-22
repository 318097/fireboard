import React from "react";
import { Button, Switch } from "@mantine/core";
import { FiLogOut } from "react-icons/fi";

const Controls = ({ activePage, pendingTasksOnly, setKey, logout }) => {
  switch (activePage) {
    case "home":
      return (
        <Switch
          size="xs"
          radius="xs"
          label={"Pending"}
          checked={pendingTasksOnly}
          onChange={(e) =>
            setKey({ pendingTasksOnly: e.currentTarget.checked })
          }
        />
      );
    case "settings":
      return (
        <Button
          rightIcon={<FiLogOut />}
          radius="xs"
          size="compact-xs"
          onClick={logout}
        >
          Logout
        </Button>
      );
    default:
      return null;
  }
};

export default Controls;
