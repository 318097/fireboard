import React from "react";
import { mantineDefaultProps } from "../appConstants";
import { Button } from "@mantine/core";

const Confirmation = ({ title = "Delete?", onConfirm, onCancel }) => {
  return (
    <div className="confirmation-box">
      <div className="title">{title}</div>
      <div className="actions">
        <Button
          {...mantineDefaultProps}
          size="compact-xs"
          variant="light"
          color="gray"
          onClick={onConfirm}
        >
          Yes
        </Button>
        <Button
          {...mantineDefaultProps}
          size="compact-xs"
          variant="light"
          color="gray"
          onClick={onCancel}
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
