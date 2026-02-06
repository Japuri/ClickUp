import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    fetchProjectsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectsSuccess: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProjectDetailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProjectDetailSuccess: (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
    },
    fetchProjectDetailFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createProjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProjectSuccess: (state, action) => {
      state.loading = false;
      state.projects.push(action.payload);
    },
    createProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
});

export const {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  fetchProjectDetailStart,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailure,
  createProjectStart,
  createProjectSuccess,
  createProjectFailure,
  clearCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;
