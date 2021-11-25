import * as lib from "@codedrops/lib";
import notify from "./notify";
import * as Sentry from "@sentry/react";

const ERROR_MAPPING = {
  ACCOUNT_SUSPENDED: {
    msg: "Account has been temporarily suspended",
  },
  ACCOUNT_DELETED: { msg: "Account deleted" },
  EMAIL_REQUIRED: { msg: "Email is required" },
  USERNAME_AND_PASSWORD_REQUIRED: {
    msg: "Username & Password are required",
  },
  USER_NOT_FOUND: { msg: "User not found" },
  UNAUTHORIZED: { msg: "Unauthorized" },
  INCORRECT_PASSWORD: { msg: "Incorrect password" },
  INVALID_USERNAME_OR_PASSWORD: {
    msg: "Invalid username/password",
  },
  INVALID_EMAIL: { msg: "Invalid email" },
  INVALID_TOKEN: { msg: "Invalid token" },
  INVALID_VERIFICATION_TOKEN: { msg: "Invalid verification token" },
};

const handleError = (error, { logout } = {}) => {
  lib.handleError(error);
  // error handling for axios
  const errorMessage = error.response ? error.response.data : error.message;

  const matchedErrorObj = ERROR_MAPPING[errorMessage];

  if (matchedErrorObj) {
    notify(matchedErrorObj.msg, "error");
    if (matchedErrorObj.logout && logout) logout();
  } else notify(errorMessage, "error");

  Sentry.captureException(error);
};

export default handleError;
