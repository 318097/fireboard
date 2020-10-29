import React, { useEffect, useState } from "react";
import colors, {
  Card,
  Icon,
  Button,
  Radio,
  Input,
  Select,
} from "@codedrops/react-ui";
import _ from "lodash";
import axios from "axios";
import "./Settings.scss";
import { constants } from "../Todos/state";

const Settings = ({ state, dispatch }) => {
  const [projectName, setProjectName] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const { activeProjectId } = state;

  const createNewProject = async () => {
    const { data } = await axios.post("/dot/project", {
      name: projectName,
    });
    dispatch({ type: constants.SET_SESSION, payload: data });
    setShowInfo(true);
  };

  const projects = _.get(state, "session.dot", []);
  const projectList = projects.map(({ _id, name }) => ({
    label: name,
    value: _id,
  }));

  return (
    <section id="settings">
      <h2>Settings</h2>
      <div className="active-project">
        <h3>Active Project</h3>
        <Select
          className="ml"
          placeholder="Select Project"
          options={projectList}
          value={activeProjectId}
          onChange={(value) =>
            dispatch({ type: constants.SET_ACTIVE_PROJECT_ID, payload: value })
          }
        />
      </div>

      {activeProjectId && (
        <div className="copy-code">
          {`Paste the following tag in 'index.html' file:`}
          <br />
          <span>{`<meta title="dot" content="${activeProjectId}" />`}</span>
        </div>
      )}

      <h3>Create new Project</h3>
      <div className="new-project">
        <Input
          autoFocus
          value={projectName}
          onChange={(e, value) => setProjectName(value)}
          className="inputbox"
          placeholder="Project Name"
        />
        <Button className="btn ml" onClick={createNewProject}>
          Create
        </Button>
      </div>
    </section>
  );
};

export default Settings;
