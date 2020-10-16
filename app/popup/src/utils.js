const isDev = true;
const key = "dot";
let data = {};

if (isDev) {
  data = JSON.parse(localStorage.getItem("dot") || "{}");
  // console.log("data::-", data);
}

function messenger(payload, cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
    chrome.tabs.sendMessage(tabs[0].id, payload, cb)
  );
}

function getData(cb) {
  if (isDev) {
    cb({ dot: data });
  } else {
    chrome.storage.sync.get([key], cb);
  }
}

function setData(value) {
  if (isDev) {
    data = value;
    localStorage.setItem("dot", JSON.stringify(value));
  } else {
    chrome.storage.sync.set({ [key]: value });
  }
}

function getToken() {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDUxOTI4YmQ2ZTU5MzAwMDRlY2NiMzgiLCJpYXQiOjE2MDI3Nzc3OTJ9.UYTt1LPOYjAMPhuJXShKKt78dRiK5K1dnsB26XCihE0";
}

export { messenger, getData, setData, getToken };
