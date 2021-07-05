import { getServerURL } from "@codedrops/lib";

console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "PRODUCTION";

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "APP",
  DEFAULT_STATE: __TYPE__ === "APP",
  LOCAL_PROJECT_KEY: "dot-project-id",
  STATE_KEY: "dot",
};

export default config;
