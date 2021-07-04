import { handleError } from "./errorHandling";

const DEFAULT_KEY_NAME = "root";

const getDataFromStorage = (key = DEFAULT_KEY_NAME) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    return data;
  } catch (error) {
    handleError(error);
  }
};

const setDataInStorage = (key = DEFAULT_KEY_NAME, value) => {
  try {
    const stringifiedValue =
      typeof value === "object" ? JSON.stringify(value) : value;

    return localStorage.setItem(key, stringifiedValue);
  } catch (error) {
    handleError(error);
  }
};

export { getDataFromStorage, setDataInStorage };
