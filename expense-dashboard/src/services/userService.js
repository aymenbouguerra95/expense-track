import api from './api';

// جلب جميع المستخدمين
export const getUsers = async () => {
  try {
    const res = await api.get('/users'); // تأكد من endpoint في backend
    return res.data;
  } catch (err) {
    console.error('Failed to fetch users', err);
    throw err;
  }
};

// جلب مستخدم واحد حسب الـ id
export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch user ${id}`, err);
    throw err;
  }
};

// حذف مستخدم
export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (err) {
    console.error(`Failed to delete user ${id}`, err);
    throw err;
  }
};

// إنشاء مستخدم جديد
export const createUser = async (data) => {
  try {
    const res = await api.post('/users', data);
    return res.data;
  } catch (err) {
    console.error('Failed to create user', err);
    throw err;
  }
};

// تحديث مستخدم
export const updateUser = async (id, data) => {
  try {
    const res = await api.patch(`/users/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to update user ${id}`, err);
    throw err;
  }
};
