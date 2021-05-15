import { StatusBar } from "@codedrops/react-ui";
const { triggerEvent } = StatusBar;

export const notify = (msg) => {
  triggerEvent("add", { expires: 3000, value: msg });
};
