import React from "react";
import { ROUTES } from "../appConstants";
import { NavLink } from "react-router-dom";
import tracker from "../lib/mixpanel";

const Navigation = ({ isAuthenticated }) => {
  return (
    <nav>
      {ROUTES({ isAuthenticated })
        .filter(({ renderRoute, showInNavbar }) => renderRoute && showInNavbar)
        .map(({ label, value }) => (
          <NavLink
            key={value}
            activeClassName={"active-page"}
            className={`nav-item`}
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
