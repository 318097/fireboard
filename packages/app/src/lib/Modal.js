import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Overlay } from "@mantine/core";
import { mantineDefaultProps } from "../appConstants";

const Modal = ({
  visible,
  title,
  content,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) => {
  return visible ? (
    <div className={"modal-root"}>
      <Overlay />
      <Card className={"modal-container"} padding="sm" shadow="sm">
        <div className={"modal-title"}>{title}</div>
        <div className={"modal-content"}>{content}</div>
        <div className={"modal-footer"}>
          <div className={"fcc gap-8"}>
            <Button
              {...mantineDefaultProps}
              size="sm"
              compact
              variant="default"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              {...mantineDefaultProps}
              size="sm"
              compact
              variant="default"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  ) : null;
};

Modal.defaultProps = {
  cancelText: "No",
  confirmText: "Yes",
};

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default Modal;
