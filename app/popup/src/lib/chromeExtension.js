import {
  getDataFromStorage as _getDataFromStorage,
  setDataInStorage as _setDataInStorage,
} from "@codedrops/lib";
import config from "../config";

const messenger = (payload, cb) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
};

const getDataFromStorage = (key = config.STATE_KEY, cb) => {
  if (config.IS_LOCAL_STORAGE) {
    const data = _getDataFromStorage(key);
    cb(data);
  } else {
    chrome.storage.local.get([key], (data = {}) => cb(data[key]));
  }
};

const setDataInStorage = (key = config.STATE_KEY, value) => {
  if (config.IS_LOCAL_STORAGE) {
    _setDataInStorage(key, value);
  } else {
    chrome.storage.local.set({ [key]: value });
  }
};

export { messenger, getDataFromStorage, setDataInStorage };
