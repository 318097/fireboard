import { Button, Card, Input, Radio, Select } from "antd";
import { Icon } from "@codedrops/react-ui";
import axios from "axios";
import { copyToClipboard } from "@codedrops/lib";
import _ from "lodash";
import React, { Fragment, useState } from "react";
import "./Settings.scss";
import config from "../../config";
import { getActiveProject } from "../../lib/helpers";
import { constants } from "../../state";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";
import notify from "../../lib/notify";

const { Option } = Select;

const Settings = ({ state, dispatch, setAppLoading, setActiveProject }) => {
  const [projectName, setProjectName] = useState("");
  // const [showInfo, setShowInfo] = useState(false);
  const { activeProjectId, session = {}, topics = [], appLoading } = state;
  const { username, name, email } = session || {};
  const projects = _.get(state, "session.dotProjects", []);

  const createNewProject = async () => {
    try {
      setAppLoading(true);
      const {
        data: { newProject },
      } = await axios.post("/dot/projects", {
        name: projectName,
      });
      dispatch({
        type: constants.SET_SESSION,
        payload: { dotProjects: [...projects, newProject] },
      });
      setProjectName("");
      notify("Project created");
      // setShowInfo(true);
      tracker.track("CREATE_PROJECT");
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const copy = (tag) => {
    copyToClipboard(tag);
    notify("Copied!");
    tracker.track("COPIED_META_TAG");
  };

  const updateTopic = async (id, update) => {
    try {
      setAppLoading(true);
      const {
        data: { result },
      } = await axios.put(`/dot/tasks/${id}`, update);
      dispatch({ type: constants.UPDATE_TOPIC, payload: result });
      // setShowInfo(true);
    } catch (error) {
      handleError(error);
    } finally {
      setAppLoading(false);
    }
  };

  const saveToLocalStorage = () => {
    setAppLoading(true);
    localStorage.setItem(config.LOCAL_PROJECT_KEY, activeProjectId);
    tracker.track("SAVE_PROJECT", { type: "LOCAL STORAGE" });
    setAppLoading(false);
  };

  const clearFromLocalStorage = () => {
    setAppLoading(true);
    localStorage.removeItem(config.LOCAL_PROJECT_KEY);
    setActiveProject();
    setAppLoading(false);
  };

  const handleProjectChange = (e, value) => {
    tracker.track("PROJECT_CHANGE");
    dispatch({
      type: constants.SET_ACTIVE_PROJECT_ID,
      payload: value,
    });
  };

  let metaProjectName;
  let storageProjectName;

  const project = getActiveProject();

  const projectList = projects.map(({ _id, name }) => {
    if (_id === project.metaTag) metaProjectName = name;
    if (_id === project.storage) storageProjectName = name;
    return {
      label: name,
      value: _id,
    };
  });

  const hasActiveStorageProject =
    activeProjectId && project.storage === activeProjectId;
  const hasActiveMetaTagProject =
    activeProjectId && project.metaTag === activeProjectId;

  const tag = `<meta title="dot:project-id" content="${activeProjectId}"/>`;

  return (
    <section id="settings">
      <div className="block">
        <h3>Basic</h3>
        <div className="wrapper">
          Name:&nbsp;
          <span>{name}</span>
        </div>
        <div className="wrapper">
          Username:&nbsp;
          <span>{`@${username}`}</span>
        </div>
        <div className="wrapper" style={{ margin: 0 }}>
          Email:&nbsp;
          <span>{email}</span>
        </div>
      </div>

      <div className="block">
        <h3>Active Project</h3>
        <div>
          <Select
            style={{ width: "150px" }}
            placeholder="Project"
            value={activeProjectId}
            onChange={(e, value) => handleProjectChange(e, value)}
          >
            {projectList.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="block">
        <h3>Active Project Meta</h3>

        <div className="wrapper">
          Project detected from storage:&nbsp;
          <span>{storageProjectName || "-"}</span>
          {hasActiveStorageProject && <Icon size={10} type="check-2" />}
        </div>

        {activeProjectId && (
          <div className="flex center mb gap">
            <Button
              onClick={saveToLocalStorage}
              disabled={hasActiveStorageProject}
            >
              {hasActiveStorageProject ? "Saved" : "Save to Local Storage"}
            </Button>
            {hasActiveStorageProject && (
              <Button type="dashed" onClick={clearFromLocalStorage}>
                Clear
              </Button>
            )}
          </div>
        )}

        <div className="wrapper">
          Project detected from meta tag:&nbsp;
          <span>{metaProjectName || "-"}</span>
          {hasActiveMetaTagProject && <Icon size={10} type="check-2" />}
        </div>

        {activeProjectId && (
          <Fragment>
            <div className="mb">
              {project.metaTag === activeProjectId
                ? "Meta tag detected:"
                : "Paste the following tag in 'index.html':"}
            </div>
            <div className="copy-code" onClick={() => copy(tag)}>
              <span>{tag}</span>
            </div>
          </Fragment>
        )}
      </div>

      {activeProjectId && (
        <div className="block">
          <h3>Project Topics</h3>
          <div className="topic-container">
            {topics.map(({ _id, content, visible, isDefault }, index) => (
              <Card size="small" key={_id}>
                <div className="topic-item">
                  <div className="content">{`${index + 1}. ${content}`}</div>
                  {!isDefault && (
                    <Radio.Group
                      style={{ flexShrink: 0 }}
                      size="small"
                      optionType="button"
                      buttonStyle="solid"
                      options={[
                        { label: "Show", value: true },
                        { label: "Hide", value: false },
                      ]}
                      value={visible}
                      onChange={(e) =>
                        updateTopic(_id, { visible: e.target.value })
                      }
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="block">
        <h3>New Project</h3>
        <div className="new-project">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />
          <Button disabled={appLoading} onClick={createNewProject}>
            Create
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Settings;
