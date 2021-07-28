import React from "react";
import { Button, Checkbox } from "@codedrops/react-ui";

const Controls = ({ activePage, pendingTasksOnly, setKey, logout }) => {
  switch (activePage) {
    case "DOT":
      return (
        <Checkbox
          size="sm"
          label={"Pending"}
          value={pendingTasksOnly}
          onChange={(e, value) => setKey({ pendingTasksOnly: value })}
        />
      );
    case "SETTINGS":
      return (
        <Button
          className="ui-button"
          skipDefaultClass={true}
          size="sm"
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
