import {
  Button,
  Card,
  Menu,
  MenuItem,
  Divider,
  ActionIcon,
} from "@mantine/core";
import markdown from "markdown-it";
import dayjs from "dayjs";
import classnames from "classnames";
import React, { Fragment } from "react";
import _ from "lodash";
import { FiCheck, FiEdit, FiTrash2, FiX, FiMoreVertical } from "react-icons/fi";
import MetaInfo from "../../lib/MetaInfo";
import { mantineDefaultProps } from "../../appConstants";

const relativeTime = require("dayjs/plugin/relativeTime");

dayjs.extend(relativeTime);

const md = markdown({
  breaks: true,
});

const getDeadlineStatus = ({ deadline, marked } = {}) => {
  if (!deadline) return null;
  deadline = dayjs(deadline);

  if (marked) return;

  const now = dayjs();
  const isExpired = now.isAfter(deadline, "day");
  return isExpired ? "EXPIRED" : "PENDING";
};

const DropdownMenu = ({
  markTodo,
  setTaskToEdit,
  setTaskToDelete,
  _id,
  marked,
}) => {
  const handleClick = (key) => {
    switch (key) {
      case "edit":
        return setTaskToEdit(_id, "TODO");
      case "delete":
        return setTaskToDelete(_id, "TODO");
      case "unmark":
        return markTodo(_id, false);
    }
  };

  const menu = [
    { id: "edit", label: "Edit", visible: true, icon: <FiEdit /> },
    { id: "delete", label: "Delete", visible: true, icon: <FiTrash2 /> },
    { id: "unmark", label: "Unmark", visible: marked, icon: <FiX /> },
  ];

  return (
    <Menu
      {...mantineDefaultProps}
      closeOnScroll={false}
      menuPosition={{ top: "100%", right: "4px" }}
      control={
        <ActionIcon size="sm">
          <FiMoreVertical />
        </ActionIcon>
      }
    >
      {_.map(_.filter(menu, { visible: true }), ({ id, label, icon }) => (
        <MenuItem key={id} icon={icon} onClick={() => handleClick(id)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

const Todo = ({
  todo: { content, _id, marked, createdAt, status },
  selectedTask,
  setTaskToEdit,
  cancelSelection,
  setTaskToDelete,
  markTodo,
  mode,
}) => {
  const { completedOn, deadline } = status || {};

  const deadlineStatus = getDeadlineStatus({ deadline, marked });

  const itemClassnames = classnames("item__fb", {
    highlight__fb: selectedTask?.mode === "EDIT" && selectedTask._id === _id,
    marked__fb: marked && mode === "ADD",
    expired__fb: deadlineStatus === "EXPIRED",
    ["in-progress__fb"]: deadlineStatus === "PENDING",
  });

  const isEditMode = Boolean(
    selectedTask?.mode === "EDIT" && selectedTask?._id === _id
  );

  const metaInfoList = _.filter(
    [
      {
        label: "Created",
        value: createdAt,
        visible: true,
        defaultView: "DATE",
      },
      {
        label: "Completed",
        value: completedOn,
        visible: marked,
        defaultView: "DATE",
      },
      {
        label: "Deadline",
        value: deadline,
        visible: !!deadline,
        defaultView: "DATE",
      },
      {
        label: deadlineStatus === "EXPIRED" ? "Expired" : "Expires",
        value: deadline,
        visible: !!deadline && !marked,
        defaultView: "DIFF",
      },
    ],
    { visible: true }
  );

  return (
    <Card key={_id} className={itemClassnames}>
      <div className="content-wrapper__fb">
        <div className="content-data__fb">
          <div
            className={"content__fb"}
            dangerouslySetInnerHTML={{
              __html: md.renderInline(decodeURI(content)),
            }}
          />
        </div>
      </div>
      <Divider className="mt-4 mb-4" variant="dashed" />
      <div className="footer__fb">
        <div className="meta-info__fb">
          {_.map(metaInfoList, (item, index) => (
            <Fragment key={item.label}>
              <MetaInfo {...item} />
              {index < metaInfoList.length - 1 && (
                <span className="ml-2 mr-2">&#8226;</span>
              )}
            </Fragment>
          ))}
        </div>
        {mode === "ADD" && (
          <div className="actions__fb">
            {isEditMode ? (
              <Button
                {...mantineDefaultProps}
                variant="link"
                onClick={cancelSelection}
              >
                Cancel
              </Button>
            ) : (
              <Fragment>
                {!marked && (
                  <ActionIcon size="sm" onClick={() => markTodo(_id, true)}>
                    <FiCheck key="check-icon" />
                  </ActionIcon>
                )}
                <DropdownMenu
                  key="more-options"
                  markTodo={markTodo}
                  setTaskToEdit={setTaskToEdit}
                  setTaskToDelete={setTaskToDelete}
                  _id={_id}
                  marked={marked}
                />
              </Fragment>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Todo;
