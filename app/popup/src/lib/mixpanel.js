import { EventTracker } from "@codedrops/lib";
import config from "../config";

const events = {
  INIT: { name: "Init", fields: ["path"] },
  CLICK_ACTION: { name: "Click action", fields: ["target"] }, // Any button click
  REGISTER: { name: "Register" },
  LOGIN: { name: "Login" },
  LOGOUT: { name: "Logout" },
  NAVIGATION: { name: "Navigation", fields: ["name"] },
  // BUY_ME_A_COFFEE: { name: "Buy me a coffee" },
  // CLICKED_SOCIAL_ICON: {
  //   name: "Clicked social icon",
  //   fields: ["platform"],
  // },
  // SUBMITTED_FEEDBACK: { name: "Submitted feedback" },
  VIEW_POST: { name: "View post", fields: ["slug", "title"] },
};

const tracker = new EventTracker({
  events,
  trackingId: config.MIXPANEL_TRACKING_ID,
  isDev: !config.IS_PROD,
});

export default tracker;
