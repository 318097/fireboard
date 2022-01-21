const ROUTES = ({ isAuthenticated } = {}) => [
  {
    label: "Home",
    value: "home",
    renderRoute: isAuthenticated,
    showInNavbar: true,
  },
  {
    label: "Today",
    value: "today",
    renderRoute: isAuthenticated,
    showInNavbar: true,
  },
  {
    label: "Timeline",
    value: "timeline",
    renderRoute: isAuthenticated,
    showInNavbar: true,
  },
  {
    label: "Settings",
    value: "settings",
    renderRoute: isAuthenticated,
    showInNavbar: true,
  },
  {
    label: "Login",
    value: "login",
    renderRoute: !isAuthenticated,
    showInNavbar: true,
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
