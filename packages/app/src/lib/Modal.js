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
    <div className={"modal-root__fb"}>
      <Overlay />
      <Card className={"modal-container__fb"} padding="sm" shadow="sm">
        <div className={"modal-title__fb"}>{title}</div>
        <div className={"modal-content__fb"}>{content}</div>
        <div className={"modal-footer__fb"}>
          <div className={"fcc gap-8"}>
            <Button
              {...mantineDefaultProps}
              size="sm"
              compact
              variant="light"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              {...mantineDefaultProps}
              size="sm"
              compact
              variant="light"
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
