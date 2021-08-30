import { Button, Input, InputWrapper } from "@mantine/core";
import React, { useState } from "react";
import axios from "axios";
import "./Auth.scss";
import { setSession, setAppLoading } from "../../redux/actions";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

const Auth = ({ appLoading, setSession, setAppLoading }) => {
  const history = useHistory();
  const [data, setData] = useState({});
  const [authState, setAuthState] = useState("LOGIN");

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    try {
      setAppLoading(true);
      if (authState === "LOGIN") {
        const { data: result } = await axios.post(`/auth/login`, data);
        setSession({ ...result, isAuthenticated: true });
        axios.defaults.headers.common["authorization"] = result.token;
        tracker.setIdentity(result);
        tracker.setUser(result);
        tracker.track("LOGIN");
        setTimeout(() => history.push("/home"), 500);
      } else {
        const { data: result } = await axios.post(`/auth/register`, data);
        setAuthState("LOGIN");
        tracker.setIdentity(result);
        tracker.setUser(result);
        tracker.track("REGISTER");
        setInputData({ email: null, name: null });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      handleAuth();
    }
  };

  const formFields = [
    { label: "Name", key: "name", visible: authState === "REGISTER" },
    { label: "Username", key: "username", visible: true },
    { label: "Email", key: "email", visible: authState === "REGISTER" },
    {
      label: "Password",
      key: "password",
      visible: true,
      props: { onKeyDown: handleKeyDown, type: "password" },
    },
  ];

  return (
    <section id="auth">
      <div className="container">
        <h3>Register</h3>
        {formFields
          .filter((field) => field.visible)
          .map(({ label, key, props = {} }) => (
            <InputWrapper key={key} required label={label} size="xs">
              <Input
                radius="xs"
                size="xs"
                placeholder={label}
                value={_.get(data, key)}
                onChange={(e) => setInputData({ [key]: e.currentTarget.value })}
                {...props}
              />
            </InputWrapper>
          ))}
        {authState === "REGISTER" ? (
          <div className="button-wrapper">
            <Button
              radius="xs"
              size="xs"
              onClick={handleAuth}
              disabled={appLoading}
            >
              Register
            </Button>
            <Button
              radius="xs"
              size="xs"
              variant="link"
              onClick={() => setAuthState("LOGIN")}
            >
              Login
            </Button>
          </div>
        ) : (
          <div className="button-wrapper">
            <Button
              radius="xs"
              size="xs"
              onClick={handleAuth}
              disabled={appLoading}
            >
              Login
            </Button>
            <Button
              radius="xs"
              size="xs"
              onClick={() => setAuthState("REGISTER")}
              variant="link"
            >
              Register
            </Button>
          </div>
      </div>
    </section>
  );
};

const mapStateToProps = ({ appLoading }) => ({
  appLoading,
});

const mapDispatchToProps = {
  setSession,
  setAppLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
