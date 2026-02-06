import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTaskStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTaskSuccess: (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    createTaskFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createTaskStart,
  createTaskSuccess,
  createTaskFailure,
} = taskSlice.actions;

export default taskSlice.reducer;
