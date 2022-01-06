import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
import VerifyAccount from "./VerifyAccount";
import Login from "./Login";
import Register from "./Register";

const AuthSystem = ({
  action,
  logout,
  appLoading,
  setAppLoading,
  setSession,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (setAppLoading) setAppLoading(loading);
  }, [loading]);

  useEffect(() => {
    return () => {
      setLoading(false);
      setSuccess(false);
      setErrorMessage("");
    };
  }, []);

  const verifyAccountStatus = async () => {
    try {
      setLoading(true);
      const parsed = queryString.parse(location.search);
      if (!parsed["verification_token"]) return;
      await axios.post("/auth/verify-account", {
        verificationToken: parsed["verification_token"],
      });
      setSuccess(true);
    } catch (error) {
      setErrorMessage(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async ({ email }) => {
    try {
      setLoading(true);
      await axios.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async ({ password }) => {
    try {
      setLoading(true);
      const parsed = queryString.parse(location.search);
      if (!parsed["reset_token"]) return;
      await axios.post("/auth/reset-password", {
        resetToken: parsed["reset_token"],
        password,
      });
      setSuccess(true);

      setTimeout(logout, 5000);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // try {
    //   setLoading(true);
    //   await axios.post("/forgot-password", { email });
    //   setSuccess(true);
    // } catch (error) {
    // } finally {
    //   setLoading(false);
    // }
  };

  const props = {
    loading: appLoading,
    setLoading,
    success,
    setSuccess,
    errorMessage,
    setErrorMessage,
    setSession,
  };
  switch (action) {
    case "FORGOT-PASSWORD":
      return <ForgotPassword {...props} handleSubmit={handleForgotPassword} />;
    case "RESET-PASSWORD":
      return <ChangePassword {...props} handleSubmit={handleResetPassword} />;
    case "CHANGE-PASSWORD":
      return <ChangePassword {...props} handleSubmit={handleChangePassword} />;
    case "VERIFY-ACCOUNT":
      return <VerifyAccount {...props} onInit={verifyAccountStatus} />;
    case "LOGIN":
      return <Login {...props} />;
    case "REGISTER":
      return <Register {...props} />;
    default:
      return null;
  }
};

export default AuthSystem;
