import * as lib from "@codedrops/lib";
import config from "../config";

const messenger = (payload, cb) => {
  if (config.isExtension) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      chrome.tabs.sendMessage(tabs[0].id, payload, cb)
    );
  } else cb();
};

const messengerPromise = (payload) =>
  new Promise((resolve) => messenger(payload, (response) => resolve(response)));

const getDataFromStorage = (cb) => {
  if (config.IS_LOCAL_STORAGE) {
    const data = lib.getDataFromStorage(config.STATE_KEY);
    cb(data);
  } else {
    chrome.storage.local.get([config.STATE_KEY], (data = {}) =>
      cb(data[config.STATE_KEY] || {})
    );
  }
};

const setDataInStorage = (value) => {
  if (config.IS_LOCAL_STORAGE) {
    lib.setDataInStorage(config.STATE_KEY, value);
  } else {
    chrome.storage.local.set({ [config.STATE_KEY]: value });
  }
};

const customStorage = (input = {}) => {
  if (config.isExtension) return messengerPromise(input);

  const { key, value, action } = input;
  let response;

  if (action === "set") {
    localStorage.setItem(key, value);
  } else if (action === "get") {
    response = localStorage.getItem(key, value);
  } else if (action === "remove") {
    localStorage.removeItem(key);
  }

  return Promise.resolve(response);
};

export {
  messenger,
  getDataFromStorage,
  setDataInStorage,
  messengerPromise,
  customStorage,
};
