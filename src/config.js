import { getServerURL } from "@codedrops/lib";

console.log("CONFIG:", __TYPE__, __ENV__);

const { MIXPANEL_TRACKING_ID, SENTRY_URL } = process.env;

const isProd = __ENV__ === "production";

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "app",
  DEFAULT_STATE: __TYPE__ === "app",
  LOCAL_PROJECT_KEY: "fireboard-project-id",
  STATE_KEY: "fireboard",
  isExtension: __TYPE__ === "ext",
  isApp: __TYPE__ === "app",
  MIXPANEL_TRACKING_ID,
  NODE_ENV: __ENV__,
  SENTRY_URL,
  APP_NAME: "FIREBOARD".split(""),
  // SENTRY_RELEASE,
};

export default config;
