import React, { useEffect, useState, Fragment } from "react";
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
import { getActiveProject } from "../../helpers";

const activatedProject = getActiveProject();

const Settings = ({ state, dispatch }) => {
  const [projectName, setProjectName] = useState("");
  // const [showInfo, setShowInfo] = useState(false);
  const { activeProjectId, session = {} } = state;
  const { username } = session || {};

  const createNewProject = async () => {
    const { data } = await axios.post("/dot/project", {
      name: projectName,
    });
    dispatch({ type: constants.SET_SESSION, payload: data });
    // setShowInfo(true);
  };

  const projects = _.get(state, "session.dot", []);
  let activeProjectName;
  const projectList = projects.map(({ _id, name }) => {
    if (_id === activatedProject) activeProjectName = name;
    return {
      label: name,
      value: _id,
    };
  });

  return (
    <section id="settings">
      <h2>Settings</h2>
      <h3 className="active-project">{`Logged in as: @${username}`}</h3>
      <h3 className="active-project">{`Default Activated Project: ${activeProjectName}`}</h3>
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
      <br />

      {activeProjectId && (
        <Fragment>
          {`Paste the following tag in 'index.html' file:`}
          <div className="copy-code">
            <span>{`<meta title="dot" content="${activeProjectId}" />`}</span>
          </div>
        </Fragment>
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
