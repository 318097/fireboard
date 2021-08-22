import React from "react";
import { ROUTES } from "../appConstants";
import { NavLink } from "react-router-dom";

const Navigation = ({ isAuthenticated }) => {
  return (
    <nav>
      {ROUTES({ isAuthenticated })
        .filter(({ visible }) => visible)
        .map(({ label, value }) => (
          <NavLink
            key={value}
            activeClassName={"active-page"}
            className={`nav-item`}
            to={value}
          >
            {label}
          </NavLink>
        ))}
    </nav>
  );
};

export default Navigation;
