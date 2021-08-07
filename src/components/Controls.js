import React from "react";
import { Button, Checkbox } from "antd";

const Controls = ({ activePage, pendingTasksOnly, setKey, logout }) => {
  switch (activePage) {
    case "DOT":
      return (
        <Checkbox
          size="small"
          checked={pendingTasksOnly}
          onChange={(e) => setKey({ pendingTasksOnly: e.target.checked })}
        >
          Pending
        </Checkbox>
      );
    case "SETTINGS":
      return (
        <Button type="danger" size="small" onClick={logout}>
          Logout
        </Button>
      );
    default:
      return null;
  }
};

export default Controls;
