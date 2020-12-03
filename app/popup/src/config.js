const env = "dev";
const config = {
  SERVER_URL: env === "production" ? "" : "http://localhost:7000/api",
  IS_DEV: true,
  LOCAL_PROJECT_KEY: "dot-project-id",
};

export default config;
