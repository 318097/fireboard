import React from "react";
import Controls from "./Controls";
import Navigation from "./Navigation";

const Header = ({
  isAuthenticated,
  activePage,
  setActivePage,
  pendingTasksOnly,
  setKey,
  logout,
}) => {
  return (
    <div className="header">
      <Navigation
        isAuthenticated={isAuthenticated}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="extra-controls">
        <Controls
          activePage={activePage}
          pendingTasksOnly={pendingTasksOnly}
          setKey={setKey}
          logout={logout}
        />
      </div>
    </div>
  );
};

export default Header;
