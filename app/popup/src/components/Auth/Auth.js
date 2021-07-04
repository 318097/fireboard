import React, { useState, useEffect } from "react";
import { Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./Auth.scss";
import { constants } from "../../state";
import { handleError } from "../../lib/errorHandling";

const Auth = ({ state, dispatch, setActivePage, setLoading }) => {
  const [data, setData] = useState({});
  const [authState, setAuthState] = useState("LOGIN");
  const { loading } = state;

  useEffect(() => {}, []);

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleAuth = async () => {
    try {
      setLoading(true);
      if (authState === "LOGIN") {
        const { data: result } = await axios.post(`/auth/login`, data);
        dispatch({
          type: constants.SET_SESSION,
          payload: { ...result, isLoggedIn: true },
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
      setLoading(false);
    }
  };

  if (authState === "REGISTER")
    return (
      <section id="auth">
        <div className="container">
          <h3>Register</h3>
          <Input
            className="inp"
            placeholder="Name"
            name="name"
            value={data.name}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            className="inp"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            className="inp"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            type="password"
            className="inp"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={(_, value) => setInputData(value)}
          />
          <div className="button-wrapper">
            <Button onClick={handleAuth} className="btn" disabled={loading}>
              Register
            </Button>
            <div onClick={() => setAuthState("LOGIN")} className="link">
              Login
            </div>
          </div>
        </div>
      </section>
    );
  else
    return (
      <section id="auth">
        <div className="container">
          <h3>Login</h3>
          <Input
            className="inp"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={(_, value) => setInputData(value)}
          />
          <Input
            type="password"
            className="inp"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={(_, value) => setInputData(value)}
          />
          <div className="button-wrapper">
            <Button onClick={handleAuth} className="btn" disabled={loading}>
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
