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
];

export { ROUTES };
