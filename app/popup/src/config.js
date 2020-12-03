const env = "dev";

const config = {
  SERVER_URL:
    env === "production"
      ? "https://bubblegum-server.herokuapp.com/api"
      : "http://localhost:7000/api",
  IS_DEV: true,
  LOCAL_PROJECT_KEY: "dot-project-id",
};

export default config;
