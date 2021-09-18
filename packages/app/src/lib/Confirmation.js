import React from "react";
import { mantineDefaultProps } from "../appConstants";
import { Button } from "@mantine/core";

const Confirmation = ({ title = "Delete?", onConfirm, onCancel }) => {
  return (
    <div className="confirmation-box__fb">
      <div className="title__fb">{title}</div>
      <div className="actions__fb">
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
