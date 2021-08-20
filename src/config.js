import { getServerURL } from "@codedrops/lib";

console.log("CONFIG:", __TYPE__, __ENV__, process.env);

const { MIXPANEL_TRACKING_ID, SENTRY_URL } = process.env;

const isProd = __ENV__ === "production";

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "app",
  DEFAULT_STATE: __TYPE__ === "app",
  LOCAL_PROJECT_KEY: "dot-project-id",
  STATE_KEY: "dot",
  isExtension: __TYPE__ === "ext",
  isApp: __TYPE__ === "app",
  MIXPANEL_TRACKING_ID,
  NODE_ENV: __ENV__,
  SENTRY_URL,
  // SENTRY_RELEASE,
};

export default config;
