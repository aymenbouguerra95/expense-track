import api from './api';

const BUDGET_URL = '/budgets';
const CATEGORY_URL = '/categories';
const PROJECT_URL = '/projects';
const USER_URL = '/users';

export const getBudgets = () => api.get(BUDGET_URL);
export const createBudget = (data) => api.post(BUDGET_URL, data);
export const deleteBudget = (id) => api.delete(`${BUDGET_URL}/${id}`);

export const getCategories = () => api.get(CATEGORY_URL);
export const getProjects = () => api.get(PROJECT_URL);
export const getUsers = () => api.get(USER_URL);
