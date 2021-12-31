import * as lib from "@codedrops/lib";
import notify from "./notify";
import * as Sentry from "@sentry/react";

const handleError = (error, { logout } = {}) => {
  lib.handleError(error, { logout, enableStatusHandling: true, notify });
  Sentry.captureException(error);
};

export default handleError;
