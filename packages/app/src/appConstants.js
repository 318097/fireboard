const ROUTES = ({ isAuthenticated } = {}) => [
  {
    label: "Home",
    value: "home",
    renderRoute: isAuthenticated,
    showInMenu: true,
  },
  {
    label: "Today",
    value: "today",
    renderRoute: isAuthenticated,
    showInMenu: true,
  },
  {
    label: "Timeline",
    value: "timeline",
    renderRoute: isAuthenticated,
    showInMenu: true,
  },
  {
    label: "Settings",
    value: "settings",
    renderRoute: isAuthenticated,
    showInMenu: true,
  },
  {
    label: "Login",
    value: "login",
    renderRoute: !isAuthenticated,
    showInMenu: true,
  },
  {
    label: "Register",
    value: "register",
    renderRoute: !isAuthenticated,
  },
  {
    value: "forgot-password",
    renderRoute: true,
  },
  {
    value: "reset-password",
    renderRoute: true,
  },
  {
    value: "change-password",
    renderRoute: true,
  },
  {
    value: "verify-account",
    renderRoute: true,
  },
  {
    value: "about",
    renderRoute: true,
  },
];

const mantineDefaultProps = {
  size: "xs",
};

export { ROUTES, mantineDefaultProps };
