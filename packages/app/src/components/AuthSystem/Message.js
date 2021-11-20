import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Alert } from "@mantine/core";
import { mantineDefaultProps } from "../../appConstants";

const Message = ({ message, ctaAction = "/auth", ctaLabel = "Home", type }) => {
  const history = useHistory();

  const handleClick = () => {
    if (ctaAction?.startsWith("/")) history.push(ctaAction);
    else window.location = ctaAction;
  };

  const title = type === "error" ? "Oops" : "Success";
  const color = type === "error" ? "red" : "green";

  return (
    <>
      <Alert title={title} color={color}>
        <div>{message}</div>
      </Alert>
      <div className="mt-12">
        <Button
          {...mantineDefaultProps}
          compact
          variant="light"
          onClick={handleClick}
        >
          {ctaLabel}
        </Button>
      </div>
    </>
  );
};

export default Message;
