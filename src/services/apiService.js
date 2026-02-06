import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/token/', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },

  getProjectDetail: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects/create/', projectData);
    return response.data;
  },
};

export const taskService = {
  createTask: async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/task/create/`, taskData);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  getManagers: async () => {
    const response = await api.get('/users/?role=manager');
    return response.data;
  },

  getRegularUsers: async () => {
    const response = await api.get('/users/?role=user');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users/create/', userData);
    return response.data;
  },
};
