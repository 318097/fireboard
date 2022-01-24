import React, { useEffect } from "react";
import Controls from "./Controls";
import Navigation from "./Navigation";
import { setActivePage, setKey } from "../redux/actions";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

const Header = ({
  isAuthenticated,
  activePage,
  pendingTasksOnly,
  setKey,
  logout,
  setActivePage,
}) => {
  const location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname.slice(1));
  }, [location.pathname]);

  return (
    <div className="header">
      <Navigation isAuthenticated={isAuthenticated} />
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

const mapStateToProps = ({ activePage, pendingTasksOnly, session }) => ({
  activePage,
  pendingTasksOnly,
  isAuthenticated: session?.isAuthenticated,
});

const mapDispatchToProps = {
  setActivePage,
  setKey,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
