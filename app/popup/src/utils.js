const isDev = true;

function messenger(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
}

function getData(key, cb) {
  if (isDev) {
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    cb(data);
  } else {
    chrome.storage.sync.get([key], cb);
  }
}

function setData(key, value) {
  if (isDev) {
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
    // getData("session", (data) =>
    //   resolve({
    //     token:
    //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxOTI4YmQ2ZTU5MzAwMDRlY2NiMzgiLCJpYXQiOjE2MDYwMzg1MzB9.axNIoaOGHB_4QRN_sUX8aW3kE1q-ht_uflFF0EXn-Vs",
    //   })
    // );
  });
}

export { messenger, getData, setData, getSessionInfo };
