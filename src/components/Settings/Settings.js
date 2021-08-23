import { Icon } from "@codedrops/react-ui";
import { Button, Card, Input, SegmentedControl, Select } from "@mantine/core";
import axios from "axios";
import { copyToClipboard } from "@codedrops/lib";
import _ from "lodash";
import React, { Fragment, useState } from "react";
import "./Settings.scss";
import config from "../../config";
import {
  setSession,
  updateTopic,
  setActiveProjectId,
  setAppLoading,
} from "../../redux/actions";
import handleError from "../../lib/errorHandling";
import tracker from "../../lib/mixpanel";
import notify from "../../lib/notify";
import { FiSave } from "react-icons/fi";
import { connect } from "react-redux";

const Settings = ({
  activeProjectId,
  session = {},
  topics = [],
  appLoading,
  setSession,
  setAppLoading,
  updateTopic,
  setActiveProjectId,
  selectedProjects,
}) => {
  const [projectName, setProjectName] = useState("");
  const { username, name, email } = session || {};
  const projects = _.get(session, "dotProjects", []);

  const createNewProject = async () => {
    try {
      setAppLoading(true);
      const {
        data: { newProject },
      } = await axios.post("/dot/projects", {
        name: projectName,
      });
      setSession({ dotProjects: [...projects, newProject] });
      setProjectName("");
      notify("Project created");
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

  const saveToLocalStorage = () => {
    localStorage.setItem(config.LOCAL_PROJECT_KEY, activeProjectId);
    setActiveProjectId();
    tracker.track("SAVE_PROJECT", { type: "LOCAL STORAGE" });
  };

  const clearFromLocalStorage = () => {
    localStorage.removeItem(config.LOCAL_PROJECT_KEY);
    setActiveProjectId();
  };

  const handleProjectChange = (value) => {
    tracker.track("SWITCH_PROJECT");
    setActiveProjectId(value);
  };

  let metaProjectName;
  let storageProjectName;

  const projectList = projects.map(({ _id, name }) => {
    if (_id === selectedProjects.metaTag) metaProjectName = name;
    if (_id === selectedProjects.storage) storageProjectName = name;
    return {
      label: name,
      value: _id,
    };
  });

  const hasActiveStorageProject =
    activeProjectId && selectedProjects.storage === activeProjectId;
  const hasActiveMetaTagProject =
    activeProjectId && selectedProjects.metaTag === activeProjectId;

  const tag = `<meta title="dot:project-id" content="${activeProjectId}"/>`;

  const Basic = (
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
  );

  const ProjectList = (
    <div className="block">
      <h3>Project List</h3>
      <div>
        <Select
          style={{ width: "150px" }}
          placeholder="Project"
          radius="xs"
          size="xs"
          data={projectList}
          value={activeProjectId}
          onChange={handleProjectChange}
        />
      </div>
    </div>
  );

  const ActiveProject = (
    <div className="block">
      <h3>Active Project</h3>

      <div className="wrapper">
        Project detected from storage:&nbsp;
        <span>{storageProjectName || "-"}</span>
        {hasActiveStorageProject && <Icon size={10} type="check-2" />}
      </div>

      {activeProjectId && (
        <div className="flex center mb gap">
          <Button
            leftIcon={<FiSave />}
            radius="xs"
            size="xs"
            className="mr"
            onClick={saveToLocalStorage}
            disabled={hasActiveStorageProject}
          >
            {hasActiveStorageProject ? "Saved" : "Save to Local Storage"}
          </Button>
          {hasActiveStorageProject && (
            <Button
              radius="xs"
              size="xs"
              variant="link"
              onClick={clearFromLocalStorage}
            >
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
            {selectedProjects.metaTag === activeProjectId
              ? "Meta tag detected:"
              : "Paste the following tag in 'index.html':"}
          </div>
          <div className="copy-code" onClick={() => copy(tag)}>
            <span>{tag}</span>
          </div>
        </Fragment>
      )}
    </div>
  );

  const TopicsList = (
    <div className="block">
      <h3>Project Topics</h3>
      <div className="topic-list">
        {topics.map(({ _id, content, visible, isDefault }, index) => (
          <Card
            key={_id}
            className="topic-item"
            radius="xs"
            shadow="xs"
            size="xs"
            padding="xs"
          >
            <div className="content">{`${index + 1}. ${content}`}</div>
            {!isDefault && (
              <div className="actions">
                <SegmentedControl
                  radius="xs"
                  size="xs"
                  data={[
                    { label: "Show", value: "show" },
                    { label: "Hide", value: "hide" },
                  ]}
                  value={visible ? "show" : "hide"}
                  onChange={(value) =>
                    updateTopic(_id, { visible: Boolean(value === "show") })
                  }
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const NewProject = (
    <div className="block">
      <h3>New Project</h3>
      <div className="new-project">
        <Input
          style={{ flexGrow: 1 }}
          radius="xs"
          size="xs"
          value={projectName}
          onChange={(e) => setProjectName(e.currentTarget.value)}
          placeholder="Project Name"
        />
        <Button
          radius="xs"
          size="xs"
          disabled={appLoading}
          onClick={createNewProject}
        >
          Create
        </Button>
      </div>
    </div>
  );

  return (
    <section id="settings">
      {Basic}
      {ProjectList}
      {ActiveProject}
      {activeProjectId && TopicsList}
      {NewProject}
    </section>
  );
};

const mapStateToProps = ({
  activeProjectId,
  session = {},
  topics = [],
  appLoading,
  selectedProjects,
}) => ({
  activeProjectId,
  session,
  appLoading,
  topics,
  selectedProjects,
});

const mapDispatchToProps = {
  setSession,
  updateTopic,
  setActiveProjectId,
  setAppLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
