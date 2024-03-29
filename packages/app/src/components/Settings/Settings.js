import React, { Fragment, useState } from "react";
import colors, { Icon } from "@codedrops/react-ui";
import {
  Button,
  Card,
  Input,
  SegmentedControl,
  Select,
  Tooltip,
} from "@mantine/core";
import axios from "axios";
import { copyToClipboard } from "@codedrops/lib";
import _ from "lodash";
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
import { FiSave, FiInfo } from "react-icons/fi";
import { connect } from "react-redux";
import { mantineDefaultProps } from "../../appConstants";
import { customStorage } from "../../lib/storage";

const TooltipWrapper = (props) => (
  <Tooltip
    allowPointerEvents
    withArrow
    wrapLines
    transitionDuration={250}
    width={180}
    delay={400}
    position="bottom"
    {...props}
  >
    <FiInfo />
  </Tooltip>
);

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
  const projects = _.get(session, "fireboardProjects", []);

  const createNewProject = async () => {
    try {
      setAppLoading(true);
      const {
        data: { newProject },
      } = await axios.post("/fireboard/projects", {
        name: projectName.trim(),
      });
      setSession({ fireboardProjects: [...projects, newProject] });
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

  const saveToLocalStorage = (id) => {
    customStorage({
      action: "set",
      key: config.LOCAL_PROJECT_KEY,
      value: id || activeProjectId,
    }).then(() => {
      if (!id) setActiveProjectId();
      tracker.track("SAVE_PROJECT_TO_LS");
    });
  };

  const clearFromLocalStorage = () => {
    customStorage({
      action: "remove",
      key: config.LOCAL_PROJECT_KEY,
    }).then(() => {
      setActiveProjectId();
    });
  };

  const handleProjectChange = (id) => {
    tracker.track("SWITCH_PROJECT");
    setActiveProjectId(id);
    if (config.isApp) saveToLocalStorage(id);
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

  const tag = `<meta title="fireboard:project-id" content="${activeProjectId}"/>`;

  const Basic = (
    <div className="block">
      <div className="header-row">
        <h3>Basic</h3>
      </div>
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
      {config.isExtension ? (
        <div className="header-row">
          <h3>Project List</h3>
          <TooltipWrapper
            label={"Select a project and save it based on your preference"}
          />
        </div>
      ) : (
        <div className="header-row">
          <h3>Projects</h3>
          <TooltipWrapper
            label={"All your work will be saved to this project"}
          />
        </div>
      )}
      <div>
        <Select
          {...mantineDefaultProps}
          nothingFound="Create a project to get started."
          style={{ width: "150px" }}
          placeholder="Project"
          data={projectList}
          value={activeProjectId}
          onChange={handleProjectChange}
        />
      </div>
    </div>
  );

  const ActiveProject = config.isExtension && (
    <div className="block">
      <div className="header-row">
        <h3>Active Project</h3>
        <TooltipWrapper
          label={
            "There are 2 ways to save the selected project. Store it in the localStorage or copy paste the meta tag into your project's index.html file (This will help in autodetecting the project)"
          }
        />
      </div>

      {!activeProjectId && (
        <div className="wrapper">
          <span>1</span>.&nbsp;Save to localStorage
        </div>
      )}

      <div className="wrapper">
        Project detected from storage:&nbsp;
        <span>{storageProjectName || "-"}</span>
        {hasActiveStorageProject && <Icon size={10} type="check-2" />}
      </div>

      {activeProjectId && (
        <div className="flex center mb gap">
          <Button
            {...mantineDefaultProps}
            leftIcon={<FiSave />}
            className="mr"
            onClick={() => saveToLocalStorage()}
            disabled={hasActiveStorageProject}
          >
            {hasActiveStorageProject ? "Saved" : "Save to Local Storage"}
          </Button>
          {hasActiveStorageProject && (
            <Button
              {...mantineDefaultProps}
              variant="default"
              onClick={clearFromLocalStorage}
            >
              Clear
            </Button>
          )}
        </div>
      )}

      {!activeProjectId && (
        <>
          <div className="wrapper mt mb">or</div>
          <div className="wrapper">
            <span>2</span>.&nbsp;Save meta tag to index.html
          </div>
        </>
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
          <div
            className="copy-code"
            style={{
              background: hasActiveMetaTagProject ? colors.cdGreen : colors.bar,
            }}
            onClick={() => copy(tag)}
          >
            <span>{tag}</span>
          </div>
        </Fragment>
      )}
    </div>
  );

  const TopicsList = (
    <div className="block">
      <div className="header-row">
        <h3>Project Topics</h3>
      </div>
      <div className="topic-list">
        {topics.map(({ _id, content, visible, isDefault }, index) => (
          <Card
            {...mantineDefaultProps}
            key={_id}
            className="topic-item"
            shadow="xs"
            padding="xs"
          >
            <div className="content">{`${index + 1}. ${content}`}</div>
            {!isDefault && (
              <div className="actions">
                <SegmentedControl
                  {...mantineDefaultProps}
                  data={[
                    { label: "Show", value: "show" },
                    { label: "Hide", value: "hide" },
                  ]}
                  value={visible ? "show" : "hide"}
                  onChange={(value) => {
                    tracker.track("ACTION", { command: value, type: "topic" });
                    updateTopic(_id, { visible: Boolean(value === "show") });
                  }}
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
      <div className="header-row">
        <h3>New Project</h3>
      </div>
      <div className="new-project">
        <Input
          style={{ flexGrow: 1 }}
          {...mantineDefaultProps}
          value={projectName}
          onChange={(e) => setProjectName(e.currentTarget.value)}
          placeholder="Project Name"
        />
        <Button
          {...mantineDefaultProps}
          disabled={appLoading || !projectName.trim()}
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
