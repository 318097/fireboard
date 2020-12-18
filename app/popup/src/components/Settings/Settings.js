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
import config from "../../config";

const Settings = ({ state, dispatch, setAppLoading }) => {
  const [projectName, setProjectName] = useState("");
  // const [showInfo, setShowInfo] = useState(false);
  const { activeProjectId, session = {}, topics = [] } = state;
  const { username } = session || {};

  const createNewProject = async () => {
    setAppLoading(true);
    const { data } = await axios.post("/dot/projects", {
      name: projectName,
    });
    dispatch({ type: constants.SET_SESSION, payload: data });
    // setShowInfo(true);
    setAppLoading(false);
  };

  const saveToLocalStorage = () =>
    localStorage.setItem(config.LOCAL_PROJECT_KEY, activeProjectId);

  const projects = _.get(state, "session.dot", []);
  let metaProjectName;
  let storageProjectName;

  const project = getActiveProject();

  const projectList = projects.map(({ _id, name }) => {
    if (_id === project.meta) metaProjectName = name;
    if (_id === project.storage) storageProjectName = name;
    return {
      label: name,
      value: _id,
    };
  });

  return (
    <section id="settings">
      <h2>Settings</h2>
      <div className="block">
        <h3>Basic</h3>
        <div className="wrapper">
          Username:&nbsp;
          <span>{`@${username}`}</span>
        </div>
        <div className="wrapper">
          Project Detected (META TAG):&nbsp;
          <span>{metaProjectName || "-"}</span>
          {project.meta === activeProjectId && (
            <Icon size={10} type="check-2" />
          )}
        </div>
        <div className="wrapper">
          Project Detected (STORAGE):&nbsp;
          <span>{storageProjectName || "-"}</span>
          {project.storage === activeProjectId && (
            <Icon size={10} type="check-2" />
          )}
        </div>
      </div>

      <div className="block">
        <h3>Active Project</h3>
        <div style={{ display: "flex" }}>
          <Select
            // style={{ width: "max-content" }}
            placeholder="Select Project"
            options={projectList}
            value={activeProjectId}
            onChange={(e, value) =>
              dispatch({
                type: constants.SET_ACTIVE_PROJECT_ID,
                payload: value,
              })
            }
          />
        </div>
        <br />
        <Button
          className="btn"
          onClick={saveToLocalStorage}
          disabled={project.storage === activeProjectId}
        >
          {project.storage === activeProjectId
            ? "Saved"
            : "Save to Local Storage"}
        </Button>
        <br />
        <br />
        {activeProjectId && (
          <Fragment>
            <div>
              {project.meta === activeProjectId
                ? "Meta tag detected"
                : "Paste the following tag in 'index.html' file:"}
            </div>
            <div className="copy-code">
              <span>{`<meta title="dot" content="${activeProjectId}" />`}</span>
            </div>
          </Fragment>
        )}
      </div>

      <div className="block">
        <h3>Project Topics</h3>
        <div>
          {topics.map(({ _id, content, visible }) => (
            <Card key={_id} className="topic-wrapper">
              <div className="content">{content}</div>
              <div className="actions">
                <Radio
                  size="sm"
                  options={[
                    { label: "On", value: true },
                    { label: "Off", value: false },
                  ]}
                  value={visible}
                  onChange={(e, value) => updateTopic({ visible: value })}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="block">
        <h3>Create new Project</h3>
        <div className="new-project">
          <Input
            autoFocus={false}
            value={projectName}
            onChange={(e, value) => setProjectName(value)}
            className="inputbox"
            placeholder="Project Name"
          />
          <Button className="btn ml" onClick={createNewProject}>
            Create
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
