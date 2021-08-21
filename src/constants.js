const ROUTES = ({ isAuthenticated } = {}) => [
  { label: "Home", value: "HOME", path: "/home", visible: isAuthenticated },
  {
    label: "Today",
    value: "TODAY",
    path: "/today",
    visible: isAuthenticated,
  },
  {
    label: "Timeline",
    value: "TIMELINE",
    path: "/timeline",
    visible: isAuthenticated,
  },
  {
    label: "Settings",
    value: "SETTINGS",
    path: "/settings",
    visible: isAuthenticated,
  },
  { label: "Auth", value: "AUTH", path: "/auth", visible: !isAuthenticated },
];

export { ROUTES };
