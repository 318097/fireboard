import React, { useEffect } from "react";
import Message from "./Message";

const VerifyAccount = ({ onInit, success, loading, errorMessage }) => {
  useEffect(() => {
    onInit();
  }, []);

  return (
    <div className="layout__fb">
      {success && !loading ? (
        <Message message="Account verified" ctaLabel={"Login"} />
      ) : (
        <Message type="error" message={errorMessage} />
      )}
    </div>
  );
};

export default VerifyAccount;
