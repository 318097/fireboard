import { Button, Input } from "antd";
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
        tracker.track("LOGIN");
        setTimeout(() => setActivePage("DOT"), 500);
      } else {
        await axios.post(`/auth/register`, data);
        // setActivePage("AUTH");
        setAuthState("LOGIN");
        tracker.track("REGISTER");
        setInputData({ email: null, name: null });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  if (authState === "REGISTER")
    return (
      <section id="auth">
        <div className="container">
          <h3>Register</h3>
          <Input
            placeholder="Name"
            value={data.name}
            onChange={(e) => setInputData({ name: e.target.value })}
          />
          <Input
            placeholder="Username"
            value={data.username}
            onChange={(e) => setInputData({ username: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => setInputData({ email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setInputData({ password: e.target.value })}
          />
          <div className="button-wrapper">
            <Button onClick={handleAuth} disabled={appLoading}>
              Register
            </Button>
            <Button type="link" onClick={() => setAuthState("LOGIN")}>
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
          placeholder="Username"
          value={data.username}
          onChange={(e) => setInputData({ username: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setInputData({ password: e.target.value })}
        />
        <div className="button-wrapper">
          <Button onClick={handleAuth} disabled={appLoading}>
            Login
          </Button>
          <Button onClick={() => setAuthState("REGISTER")} type="link">
            Register
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Auth;
