import { Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import React, { useState } from "react";
import "./Auth.scss";
import { constants } from "../../state";
import handleError from "../../lib/errorHandling";

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
        setActivePage("DOT");
      } else {
        await axios.post(`/auth/register`, data);
        setActivePage("AUTH");
        setAuthState("LOGIN");
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
            className="ui-input"
            placeholder="Name"
            name="name"
            value={data.name}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            className="ui-input"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            className="ui-input"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            type="password"
            className="ui-input"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={(_, value) => setInputData(value)}
          />
          <div className="button-wrapper">
            <Button
              onClick={handleAuth}
              className="ui-button"
              skipDefaultClass={true}
              disabled={appLoading}
            >
              Register
            </Button>
            <div onClick={() => setAuthState("LOGIN")} className="link">
              Login
            </div>
          </div>
        </div>
      </section>
    );
  return (
    <section id="auth">
      <div className="container">
        <h3>Login</h3>
        <Input
          className="ui-input"
          placeholder="Username"
          name="username"
          value={data.username}
          onChange={(_, value) => setInputData(value)}
        />
        <Input
          type="password"
          className="ui-input"
          placeholder="Password"
          name="password"
          value={data.password}
          onChange={(_, value) => setInputData(value)}
        />
        <div className="button-wrapper">
          <Button
            onClick={handleAuth}
            className="ui-button"
            disabled={appLoading}
          >
            Login
          </Button>
          <div onClick={() => setAuthState("REGISTER")} className="link">
            Register
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;