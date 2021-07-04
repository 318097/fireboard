import config from "../config";
import * as ls from "./localStorage";

const messenger = (payload, cb) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
};

const getDataFromStorage = (key = config.STATE_KEY, cb) => {
  if (config.IS_LOCAL_STORAGE) {
    const data = ls.getDataFromStorage(key);
    cb(data);
  } else {
    chrome.storage.local.get([key], (data = {}) => cb(data[key]));
  }
};

const setDataInStorage = (key = config.STATE_KEY, value) => {
  if (config.IS_LOCAL_STORAGE) {
    ls.setDataInStorage(key, value);
  } else {
    chrome.storage.local.set({ [key]: value });
  }
};

export { messenger, getDataFromStorage, setDataInStorage };
