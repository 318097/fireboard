import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import "./index.css";

const app = document.createElement("span");
app.id = "my-extension-root";

document.body.appendChild(app);

console.log("DOT.");
ReactDOM.render(<App />, app);
