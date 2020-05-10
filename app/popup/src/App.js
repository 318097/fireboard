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
        <div className="init-icon" onClick={toggleState}></div>
      )}
    </Fragment>
  );
};

export default App;
