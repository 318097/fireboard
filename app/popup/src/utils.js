import config from "./config";

function messenger(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
}

function getData(key, cb) {
  if (config.IS_DEV) {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    cb(data);
  } else {
    chrome.storage.sync.get([key], cb);
  }
}

function setDataInStorage(key, value) {
  if (config.IS_DEV) {
    localStorage.setItem(
      key,
      typeof value === "object" ? JSON.stringify(value) : value
    );
  } else {
    chrome.storage.sync.set({ [key]: value });
  }
}

async function getSessionInfo() {
  return new Promise((resolve) => {
    getData("session", (data) => resolve(data));
  });
}

export { messenger, getData, setDataInStorage, getSessionInfo };
