// import React from "react";
// import ReactDOM from "react-dom";
// import App from "../../App";
// import "./index.ext.scss";

// const app = document.createElement("span");
// app.id = "extension-root";

// document.body.appendChild(app);

// /* Inject font - start */
// const fontFamily = document.createElement("link");
// fontFamily.rel = "preconnect";
// fontFamily.href = "https://fonts.gstatic.com";
// document.head.appendChild(fontFamily);

// const font = document.createElement("link");
// font.rel = "stylesheet";
// font.href =
//   "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap";
// document.head.appendChild(font);
// /* Inject font - end */

// ReactDOM.render(<App />, app);

import React from "react";
import ReactDOM from "react-dom";
import App from "../../App";
import "./index.ext.scss";

ReactDOM.render(<App />, document.getElementById("root"));
