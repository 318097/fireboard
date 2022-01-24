import React, { useState } from "react";
import InputField from "./InputField";
import { Button } from "@mantine/core";
import Message from "./Message";

const ChangePassword = ({
  handleSubmit,
  success,
  loading,
  successMessage = "Password updated successfully. Redirecting to login page.",
}) => {
  const [password, setPassword] = useState("");

  const handleOnClick = async () => {
    await handleSubmit({ password });
  };

  return (
    <div className="layout">
      {success ? (
        <Message message={successMessage} />
      ) : (
        <>
          <InputField
            type="password"
            title="New password"
            required
            placeholder="Password"
            onChange={({ value }) => setPassword(value)}
          />
          <Button disabled={loading} className="mt" onClick={handleOnClick}>
            Update
          </Button>
        </>
      )}
    </div>
  );
};

export default ChangePassword;
