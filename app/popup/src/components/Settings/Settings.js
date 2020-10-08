import React, { useEffect } from "react";
import colors, { Card, Icon, Button, Radio, Select } from "@codedrops/react-ui";
// import "./Nav.scss";

const Settings = () => {
  console.log(document.title);
  var x = document.getElementsByTagName("META");
  for (let i = 0; i < x.length; i++) {
    console.log(x[i].title, x[i].content);
  }

  return <section>Settings</section>;
};

export default Settings;
