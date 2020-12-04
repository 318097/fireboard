import config from "./config";

function messenger(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
}

function getDataFromStorage(key = config.STATE_KEY, cb) {
  if (config.IS_DEV) {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    cb(data);
  } else {
    chrome.storage.sync.get([key], (data) => cb(data[key]));
  }
}

function setDataInStorage(key = config.STATE_KEY, value) {
  if (config.IS_DEV) {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    );
  } else {
    chrome.storage.sync.set({ [key]: value });
  }
}

export { messenger, getDataFromStorage, setDataInStorage };
