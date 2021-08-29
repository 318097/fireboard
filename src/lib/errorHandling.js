import * as lib from "@codedrops/lib";
import notify from "./notify";
import * as Sentry from "@sentry/react";

const handleError = (error) => {
  lib.handleError(error);
  // error handling for axios
  const errorMessage = error.response ? error.response.data : error.message;

  notify(errorMessage, "error");
  Sentry.captureException(error);
};

export default handleError;
