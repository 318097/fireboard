import React, { useState, useEffect } from "react";
import colors, { Card, Icon, Button, Input } from "@codedrops/react-ui";
import axios from "axios";
import "./Auth.scss";

const Auth = ({ state, dispatch }) => {
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {}, []);

  const setInputData = (update) => setData((prev) => ({ ...prev, ...update }));

  const handleLogin = async () => {
    const { data } = await axios.post(`/auth/login`);
  };

  return (
    <section id="auth">
      <div className="container">
        <h3>Login</h3>
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
