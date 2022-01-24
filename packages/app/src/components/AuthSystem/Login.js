import { Button, Input, InputWrapper } from "@mantine/core";
import React, { useState } from "react";
import axios from "axios";
import "./index.scss";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { mantineDefaultProps } from "../../appConstants";

const Login = ({ loading, setSession, setLoading }) => {
  const history = useHistory();
  const [data, setData] = useState({});

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    try {
      setLoading(true);
      const { data: result } = await axios.post(`/auth/login`, data);
      setSession({ ...result, isAuthenticated: true });
      axios.defaults.headers.common["authorization"] = result.token;
      tracker.setIdentity(result);
      tracker.setUser(result);
      tracker.track("LOGIN");
      setTimeout(() => history.push("/home"), 500);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.keyCode === 13) {
      handleAuth();
    }
  };

  const formFields = [
    { label: "Username", key: "username" },
    {
      label: "Password",
      key: "password",
      props: { onKeyDown: handleKeyDown, type: "password" },
    },
  ];

  const isFormEnabled = formFields.every(({ key }) => data[key]);

  return (
    <section id="auth">
      <div className="container">
        <h3>Login</h3>
        {formFields.map(({ label, key, props = {} }) => (
          <InputWrapper
            {...mantineDefaultProps}
            key={key}
            required
            label={label}
          >
            <Input
              {...mantineDefaultProps}
              {...props}
              placeholder={label}
              value={_.get(data, key, "")}
              onChange={(e) => setInputData({ [key]: e.currentTarget.value })}
            />
          </InputWrapper>
        ))}
        <div className="button-wrapper">
          <Button
            {...mantineDefaultProps}
            onClick={handleAuth}
            disabled={loading || !isFormEnabled}
          >
            Login
          </Button>
          <Button
            {...mantineDefaultProps}
            variant="link"
            onClick={() => history.push("/register")}
          >
            Register
          </Button>
        </div>
        <Button
          {...mantineDefaultProps}
          variant="link"
          onClick={() => history.push("/forgot-password")}
        >
          Forgot password?
        </Button>
      </div>
    </section>
  );
};

export default Login;
