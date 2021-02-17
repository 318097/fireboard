import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import "./index.css";

const app = document.createElement("span");
app.id = "my-extension-root";

document.body.appendChild(app);

const fontFamily = document.createElement("link");
fontFamily.rel = "preconnect";
fontFamily.href = "https://fonts.gstatic.com";

document.head.appendChild(fontFamily);

const font = document.createElement("link");
font.href =
  "https://fonts.googleapis.com/css2?family=Fira+Mono:wght@400;500;700&display=swap";
font.rel = "stylesheet";

document.head.appendChild(font);

console.log("DOT.");
ReactDOM.render(<App />, app);
