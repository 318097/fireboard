chrome.runtime.onMessage.addListener((input, sender, reply) => {
  const { key, value, action } = input;
  let response;

  if (action === "set") {
    localStorage.setItem(key, value);
  } else if (action === "get") {
    response = localStorage.getItem(key, value);
  } else if (action === "remove") {
    localStorage.removeItem(key);
  } else if (action === "meta") {
    const nodes = document.getElementsByTagName("META");
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].title === "fireboard:project-id") {
        response = nodes[i].content;
        break;
      }
    }
  }

  reply(response);
});
