console.log("CONFIG:", __TYPE__, __ENV__);

const isProd = __ENV__ === "PRODUCTION";

const getServerURL = ({ isProd = false, serverType = "lambda" } = {}) => {
  const connectToLambda = serverType === "lambda";
  const LAMBDA_PROD =
    "https://bubblegum-lambda.netlify.app/.netlify/functions/api";
  const HEROKU_PROD = "https://bubblegum-server.herokuapp.com/api";
  const LOCAL_SERVER = "http://localhost:7000/api";

  if (isProd) return connectToLambda ? LAMBDA_PROD : HEROKU_PROD;

  return LOCAL_SERVER;
};

const config = {
  SERVER_URL: getServerURL({ isProd }),
  IS_LOCAL_STORAGE: __TYPE__ === "APP",
  DEFAULT_STATE: __TYPE__ === "APP",
  LOCAL_PROJECT_KEY: "dot-project-id",
  STATE_KEY: "dot",
};

export default config;
