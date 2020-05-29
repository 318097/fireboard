import React, { useState, useEffect, Fragment } from "react";
import "./App.scss";
import colors, { Card, Icon, Button, Radio, Select } from "@codedrops/react-ui";
import Todos from "./components/Todos";
import Nav from "./components/Nav";
// import { messenger, getData, setData } from "./utils";

const App = () => {
  const [state, setState] = useState(false);

  const toggleState = () => setState(prev => !prev);

  return (
    <Fragment>
      {state ? (
        <div className="dot-container">
          <span className="close-icon" onClick={toggleState}>
            <Icon type="cancel-2" />
          </span>
          <Card>
            <Nav />
            <Todos toggleState={toggleState} />
          </Card>
        </div>
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </Fragment>
  );
};

export default App;
