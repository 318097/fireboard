const isProd = false;

const config = {
  SERVER_URL: isProd
    ? "https://bubblegum-server.herokuapp.com/api"
    : "http://localhost:7000/api",
  IS_DEV: false,
  LOCAL_PROJECT_KEY: "dot-project-id",
  STATE_KEY: "dot",
};

export default config;
