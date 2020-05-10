import React, { useState, useEffect, Fragment } from "react";
import "./App.scss";

import Todos from "./components/Todos";
// import { messenger, getData, setData } from "./utils";

const App = () => {
  const [state, setState] = useState(false);

  const toggleState = () => setState(prev => !prev);

  return (
    <Fragment>
      {state ? (
        <Todos toggleState={toggleState} />
      ) : (
        <span className="dot" onClick={toggleState}></span>
      )}
    </Fragment>
  );
};

export default App;
