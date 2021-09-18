import { StatusBar } from "@codedrops/react-ui";

const notify = (msg, type = "success") => {
  setTimeout(() => StatusBar.notify(msg, { type }), 300);
};

export default notify;
