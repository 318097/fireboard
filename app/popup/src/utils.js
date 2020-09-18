const isDev = true;
let data = {};

function messenger(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
}

function getData(key, cb) {
  if (isDev) {
    cb(data);
  } else {
    chrome.storage.sync.get([key], cb);
  }
}

function setData(key, value) {
  if (isDev) {
    data = value;
  } else {
    chrome.storage.sync.set({ [key]: value });
  }
}

export { messenger, getData, setData };
