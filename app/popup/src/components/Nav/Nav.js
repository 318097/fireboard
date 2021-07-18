import colors, { Icon } from "@codedrops/react-ui";
import React from "react";
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
