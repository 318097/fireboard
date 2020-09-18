import React from "react";
import colors, { Card, Icon, Button, Radio, Select } from "@codedrops/react-ui";
import "./Nav.scss";

const Nav = () => {
  return (
    <nav>
      <span>
        <Icon type="home" fill={colors.steel} />
      </span>
    </nav>
  );
};

export default Nav;
