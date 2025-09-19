import axios from 'axios';

const API_URL = 'http://localhost:3000/projects'; // غيّر إذا backend في بورت آخر

export const getProjects = () => axios.get(API_URL);
export const getProject = (id) => axios.get(`${API_URL}/${id}`);
export const createProject = (data) => axios.post(API_URL, data);
export const updateProject = (id, data) => axios.patch(`${API_URL}/${id}`, data);
export const deleteProject = (id) => axios.delete(`${API_URL}/${id}`);
