// dont destructure, it does not work in next.js
const NODE_ENV = process.env.NODE_ENV;
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

const config = {
  NODE_ENV,
  IS_DEV: NODE_ENV === "development",
  IS_PROD: NODE_ENV === "production",
  CRISP_WEBSITE_ID,
};

export default config;
