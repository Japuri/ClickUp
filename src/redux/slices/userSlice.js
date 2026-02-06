import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  managers: [],
  regularUsers: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchManagersSuccess: (state, action) => {
      state.managers = action.payload;
    },
    fetchRegularUsersSuccess: (state, action) => {
      state.regularUsers = action.payload;
    },
    createUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createUserSuccess: (state, action) => {
      state.loading = false;
      state.users.push(action.payload);
    },
    createUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchManagersSuccess,
  fetchRegularUsersSuccess,
  createUserStart,
  createUserSuccess,
  createUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
