import { EventTracker } from "@codedrops/lib";
import config from "../config";

const events = {
  INIT: { name: "Init", fields: ["path"] },
  ACTION: { name: "Action", fields: ["command", "type"] },
  REGISTER: { name: "Register" },
  LOGIN: { name: "Login" },
  LOGOUT: { name: "Logout" },
  NAVIGATION: { name: "Navigation", fields: ["name"] },
  ADD_TASK: { name: "Add task", fields: ["type"] },
  UPDATE_TASK: { name: "Update task", fields: ["type"] },
  DELETE_TASK: { name: "Delete task", fields: ["type"] },
  MARK_AS_DONE: { name: "Mark as done" }, // only for todo
  CREATE_PROJECT: { name: "Create project" },
  SWITCH_PROJECT: { name: "Switch project" },
  SAVE_PROJECT_TO_LS: { name: "Save project to LS" },
  COPIED_META_TAG: { name: "Copied meta tag" },
  OTHER_PRODUCTS: { name: "Other products", fields: ["name"] },
  SUPPORT: { name: "Support", fields: ["type"] },
  // CLICKED_SOCIAL_ICON: {
  //   name: "Clicked social icon",
  //   fields: ["platform"],
  // },
  // SUBMITTED_FEEDBACK: { name: "Submitted feedback" },
};

const tracker = new EventTracker(
  {
    events,
    trackingId: config.MIXPANEL_TRACKING_ID,
    isDev: !config.IS_PROD,
  },
  {
    defaultProperties: { appSource: __TYPE__ },
  }
);

export default tracker;
