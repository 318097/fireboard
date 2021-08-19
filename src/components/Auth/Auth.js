import { Button, Input } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import "./Auth.scss";
import { constants } from "../../state";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";

const Auth = ({ state, dispatch, setActivePage, setAppLoading }) => {
  const [data, setData] = useState({});
  const [authState, setAuthState] = useState("LOGIN");
  const { appLoading } = state;

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    try {
      setAppLoading(true);
      if (authState === "LOGIN") {
        const { data: result } = await axios.post(`/auth/login`, data);
        dispatch({
          type: constants.SET_SESSION,
          payload: { ...result, isAuthenticated: true },
        });
        axios.defaults.headers.common["authorization"] = result.token;
        tracker.setIdentity(result);
        tracker.setUser(result);
        tracker.track("LOGIN");
        setTimeout(() => setActivePage("DOT"), 500);
      } else {
        const { data: result } = await axios.post(`/auth/register`, data);
        // setActivePage("AUTH");
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

  if (authState === "REGISTER")
    return (
      <section id="auth">
        <div className="container">
          <h3>Register</h3>
          <Input
            radius="xs"
            size="xs"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setInputData({ name: e.currentTarget.value })}
          />
          <Input
            radius="xs"
            size="xs"
            placeholder="Username"
            value={data.username}
            onChange={(e) => setInputData({ username: e.currentTarget.value })}
          />
          <Input
            radius="xs"
            size="xs"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setInputData({ email: e.currentTarget.value })}
          />
          <Input
            radius="xs"
            size="xs"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setInputData({ password: e.currentTarget.value })}
          />
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
        </div>
      </section>
    );
  return (
    <section id="auth">
      <div className="container">
        <h3>Login</h3>
        <Input
          radius="xs"
          size="xs"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setInputData({ username: e.currentTarget.value })}
        />
        <Input
          radius="xs"
          size="xs"
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setInputData({ password: e.currentTarget.value })}
          onKeyDown={handleKeyDown}
        />
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

export default Auth;
