const ROUTES = ({ isAuthenticated } = {}) => [
  { label: "Home", value: "home", path: "/home", visible: isAuthenticated },
  {
    label: "Today",
    value: "today",
    path: "/today",
    visible: isAuthenticated,
  },
  {
    label: "Timeline",
    value: "timeline",
    path: "/timeline",
    visible: isAuthenticated,
  },
  {
    label: "Settings",
    value: "settings",
    path: "/settings",
    visible: isAuthenticated,
  },
  { label: "Auth", value: "auth", path: "/auth", visible: !isAuthenticated },
  {
    label: "FP",
    value: "forgot-password",
    path: "/forgot-password",
    visible: true,
    hideInMenu: true,
  },
  {
    label: "FP",
    value: "reset-password",
    path: "/reset-password",
    visible: true,
    hideInMenu: true,
  },
  {
    label: "FP",
    value: "change-password",
    path: "/change-password",
    visible: true,
    hideInMenu: true,
  },
  {
    label: "FP",
    value: "verify-account",
    path: "/verify-account",
    visible: true,
    hideInMenu: true,
  },
  {
    label: "About",
    value: "about",
    path: "/about",
    visible: true,
    hideInMenu: true,
  },
];

const mantineDefaultProps = {
  size: "xs",
};

export { ROUTES, mantineDefaultProps };
