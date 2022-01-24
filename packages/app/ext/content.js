chrome.runtime.onMessage.addListener((input, sender, reply) => {
  const { key, value, action } = input;
  let response;

  if (action === "set") {
    localStorage.setItem(key, value);
  } else if (action === "get") {
    response = localStorage.getItem(key, value);
  } else if (action === "remove") {
    localStorage.removeItem(key);
  }

  reply(response);
});
