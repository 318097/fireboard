import React from "react";
import { Button, Switch } from "@mantine/core";
import { FiLogOut } from "react-icons/fi";
import { mantineDefaultProps } from "../appConstants";

const Controls = ({ activePage, pendingTasksOnly, setKey, logout }) => {
  switch (activePage) {
    case "home":
      return (
        <Switch
          {...mantineDefaultProps}
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
          size="compact-xs"
          variant="light"
          onClick={logout}
          color="red"
        >
          Logout
        </Button>
      );
    default:
      return null;
  }
};

export default Controls;
