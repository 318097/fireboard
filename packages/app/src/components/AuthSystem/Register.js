import { Button, Input, InputWrapper } from "@mantine/core";
import React, { useState } from "react";
import axios from "axios";
import "./index.scss";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { mantineDefaultProps } from "../../appConstants";
import notify from "../../lib/notify";

const Login = ({ loading, setLoading }) => {
  const history = useHistory();
  const [data, setData] = useState({});

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    try {
      setLoading(true);
      const { data: result } = await axios.post(`/auth/register`, data);
      tracker.setIdentity(result);
      tracker.setUser(result);
      tracker.track("REGISTER");
      setInputData({ email: undefined, name: undefined });
      notify("Success");
      history.push("/login");
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
    { label: "Name", key: "name" },
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    {
      label: "Password",
      key: "password",

      props: { onKeyDown: handleKeyDown, type: "password" },
    },
  ];

  const isFormEnabled = formFields.every(({ key }) => data[key]);

  return (
    <section id="auth">
      <div className="container__fb">
        <h3>Register</h3>
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
        <div className="button-wrapper__fb">
          <Button
            {...mantineDefaultProps}
            onClick={handleAuth}
            disabled={loading || !isFormEnabled}
          >
            Register
          </Button>
          <Button
            {...mantineDefaultProps}
            variant="link"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Login;
