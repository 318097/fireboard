import axios from "axios";
import _ from "lodash";
import constants from "./constants";
import handleError from "../lib/errorHandling";
import notify from "../lib/notify";
import tracker from "../lib/mixpanel";

const setTopics = (topics) => ({
  type: constants.SET_TOPICS,
  payload: topics,
});

const setTodos = (todos) => ({
  type: constants.SET_TODOS,
  payload: todos,
});

const setActivePage = (page) => ({
  type: constants.SET_ACTIVE_PAGE,
  payload: page,
});

const setSession = (payload) => ({
  type: constants.SET_SESSION,
  payload: payload,
});

const setTaskToEdit = (_id, type) => ({
  type: constants.SET_TASK_FOR_EDIT,
  payload: {
    _id,
    type,
    mode: "EDIT",
  },
});

const setKey = (payload) => ({
  type: constants.SET_KEY,
  payload: payload,
});

const clear = () => ({
  type: constants.CLEAR,
});

const setActiveProjectId = (payload) => ({
  type: constants.SET_ACTIVE_PROJECT_ID,
  payload: payload,
});

const updateItemStatus = (payload) => ({
  type: constants.UPDATE_TOPIC_SETTINGS,
  payload,
});

const setAppLoading = (payload) => ({
  type: constants.SET_LOADING,
  payload: payload,
});

const fetchData = () => async (dispatch, getState) => {
  try {
    const { activeProjectId } = getState();
    dispatch(setAppLoading(true));
    const {
      data: { todos = [], topics = [] },
    } = await axios.get(`/dot/tasks?projectId=${activeProjectId}`);
    dispatch(setTopics(topics));
    dispatch(setTodos(todos));
  } catch (error) {
    handleError(error);
  } finally {
    dispatch(setAppLoading(false));
  }
};

const validateProjectId = () => async (dispatch, getState) => {
  const { session, activeProjectId } = getState();
  let valid = false;
  _.get(session, "dotProjects", []).forEach(({ _id }) => {
    if (_id === activeProjectId) valid = true;
  });
  dispatch(setKey({ isProjectIdValid: valid }));
};

const updateTopic = (id, update) => async (dispatch) => {
  try {
    dispatch(setAppLoading(true));
    const {
      data: { result },
    } = await axios.put(`/dot/tasks/${id}`, update);
    dispatch({ type: constants.UPDATE_TOPIC, payload: result });
    // setShowInfo(true);
  } catch (error) {
    handleError(error);
  } finally {
    dispatch(setAppLoading(false));
  }
};

const updateTask = (id, update, type) => async (dispatch, getState) => {
  dispatch(setAppLoading(true));
  const {
    data: { result },
  } = await axios.put(`/dot/tasks/${id}`, update);
  dispatch({ type: constants.UPDATE_TASK, payload: result });
  notify(`${type === "TODO" ? "Todo" : "Topic"} updated`);
  dispatch(setAppLoading(false));
};

const deleteTask = (_id, type) => async (dispatch, getState) => {
  try {
    dispatch(setAppLoading(true));
    await axios.delete(`/dot/tasks/${_id}`);
    dispatch({ type: constants.DELETE_TASK, payload: { _id, type } });
    notify("Deleted");
  } catch (error) {
    handleError(error);
  } finally {
    dispatch(setAppLoading(false));
  }
};

const markTodo = (_id, marked) => async (dispatch, getState) => {
  dispatch(setAppLoading(true));
  try {
    const {
      data: { result },
    } = await axios.put(`/dot/tasks/${_id}/stamp`, { marked });
    dispatch({ type: constants.MARK_TODO, payload: result });
    notify(marked ? "Marked as done" : "Marked as undone");
    tracker.track("MARK_AS_DONE");
  } catch (error) {
    handleError(error);
  } finally {
    dispatch(setAppLoading(false));
  }
};

const addTask = () => async (dispatch, getState) => {
  const { data, topics, activeProjectId } = getState();
  const { type, content, marked, deadline } = data || {};
  let { parentId } = data || {};

  if (!content) return;
  try {
    dispatch(setAppLoading(true));
    let formData = {
      content,
      projectId: activeProjectId,
      type,
    };
    if (type === "TODO") {
      if (!parentId) parentId = topics.find((topic) => topic.isDefault)?._id;

      formData = {
        ...formData,
        parentId,
        marked,
        deadline,
      };
    }
    const {
      data: { result },
    } = await axios.post("/dot/tasks", formData);

    dispatch({
      type: type === "TOPIC" ? constants.ADD_TOPIC : constants.ADD_TODO,
      payload: result,
    });
    notify(type === "TOPIC" ? "Topic created" : "Todo created");
    tracker.track("ADD_TASK", { type: type });
  } catch (error) {
    handleError(error);
  } finally {
    dispatch(setAppLoading(false));
  }
};

const handleChange = (update) => ({
  type: constants.SET_DATA,
  payload: update,
});

export {
  setTopics,
  setTodos,
  setSession,
  setKey,
  setActiveProjectId,
  updateItemStatus,
  setAppLoading,
  fetchData,
  validateProjectId,
  updateTopic,
  setTaskToEdit,
  clear,
  updateTask,
  deleteTask,
  markTodo,
  handleChange,
  setActivePage,
  addTask,
};