import React from "react";
import { ROUTES } from "../appConstants";
import { NavLink } from "react-router-dom";
import tracker from "../lib/mixpanel";

const Navigation = ({ isAuthenticated }) => {
  return (
    <nav>
      {ROUTES({ isAuthenticated })
        .filter(({ visible, value }) => visible && value !== "about")
        .map(({ label, value }) => (
          <NavLink
            key={value}
            activeClassName={"active-page__fb"}
            className={`nav-item__fb`}
            to={value}
            onClick={() => tracker.track("NAVIGATION", { name: value })}
          >
            {label}
          </NavLink>
        ))}
    </nav>
  );
};

export default Navigation;
