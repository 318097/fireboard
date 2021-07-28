import React from "react";

const navItems = ({ isAuthenticated }) =>
  [
    { label: "Dot", value: "DOT", visible: isAuthenticated },
    { label: "Today", value: "TODAY", visible: isAuthenticated },
    { label: "Timeline", value: "TIMELINE", visible: isAuthenticated },
    { label: "Settings", value: "SETTINGS", visible: isAuthenticated },
    { label: "Auth", value: "AUTH", visible: !isAuthenticated },
  ].filter(({ visible }) => visible);

const Navigation = ({ isAuthenticated, activePage, setActivePage }) => {
  return (
    <nav>
      {navItems({ isAuthenticated }).map(({ label, value }) => (
        <span
          key={value}
          className={`nav-item ${activePage === value ? "active-page" : ""}`}
          onClick={() => setActivePage(value)}
        >
          {label}
        </span>
      ))}
    </nav>
  );
};

export default Navigation;
