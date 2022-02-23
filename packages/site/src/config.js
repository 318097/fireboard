const NODE_ENV = process.env.NODE_ENV;
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

const config = {
  NODE_ENV,
  isDev: NODE_ENV === "development",
  isProd: NODE_ENV === "production",
  CRISP_WEBSITE_ID,
};

export default config;
