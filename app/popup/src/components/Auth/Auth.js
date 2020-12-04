import React, { useState, useEffect } from "react";
import colors, { Card, Icon, Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./Auth.scss";
import { constants } from "../Todos/state";
import { setDataInStorage } from "../../utils";

const Auth = ({ state, dispatch, setActivePage, setAppLoading }) => {
  const [data, setData] = useState({ username: "", password: "" });

  useEffect(() => {}, []);

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleLogin = async () => {
    setAppLoading(true);
    const { data: result } = await axios.post(`/auth/login`, data);
    dispatch({
      type: constants.SET_SESSION,
      payload: { ...result, isLoggedIn: true },
    });
    setActivePage("DOT");
    setAppLoading(false);
  };

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
          <Button onClick={handleLogin} className="btn">
            Login
          </Button>
          <div className="link">Register</div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
