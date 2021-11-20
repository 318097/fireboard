import React, { useState } from "react";
import InputField from "./InputField";
import { Button } from "@mantine/core";
import Message from "./Message";
import { mantineDefaultProps } from "../../appConstants";

const ForgotPassword = ({
  handleSubmit,
  success,
  loading,
  successMessage = "Reset link has been sent to your registered email.",
}) => {
  const [email, setEmail] = useState("");

  const handleOnClick = async () => {
    await handleSubmit({ email });
  };

  return (
    <div className="layout__fb">
      {success ? (
        <Message message={successMessage} />
      ) : (
        <>
          <InputField
            title="Registered email id"
            required
            placeholder="Email"
            onChange={({ value }) => setEmail(value)}
          />
          <Button
            {...mantineDefaultProps}
            onClick={handleOnClick}
            disabled={!email || loading}
            className="mt"
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
