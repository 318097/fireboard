const env = process.env.NODE_ENV;

const config = {
  env,
  isDev: env === "development",
  isProd: env === "production",
};

export default config;
