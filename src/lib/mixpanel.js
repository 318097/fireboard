import { EventTracker } from "@codedrops/lib";
import config from "../config";

const events = {
  INIT: { name: "Init", fields: ["path"] },
  CLICK_ACTION: { name: "Click action", fields: ["target"] }, // Any button click
  REGISTER: { name: "Register" },
  LOGIN: { name: "Login" },
  LOGOUT: { name: "Logout" },
  NAVIGATION: { name: "Navigation", fields: ["name"] },
  ADD_TASK: { name: "Add Task", fields: ["type"] },
  MARK_AS_DONE: { name: "Mark as done" }, // only for todo
  CREATE_PROJECT: { name: "Create project" },
  SWITCH_PROJECT: { name: "Switch project" },
  SAVE_PROJECT: { name: "Save project", fields: ["type"] }, // type: meta|localstorage
  COPIED_META_TAG: { name: "Copied meta tag" },
  // BUY_ME_A_COFFEE: { name: "Buy me a coffee" },
  // CLICKED_SOCIAL_ICON: {
  //   name: "Clicked social icon",
  //   fields: ["platform"],
  // },
  // SUBMITTED_FEEDBACK: { name: "Submitted feedback" },
  VIEW_POST: { name: "View post", fields: ["slug", "title"] },
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
