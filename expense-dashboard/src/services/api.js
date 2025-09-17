import axios from 'axios';

const API_URL = 'http://localhost:3000'; // هنا حط البورت بتاع الـ backend

const api = axios.create({
  baseURL: API_URL,
});

// إضافة الـ token تلقائياً لكل request بعد تسجيل الدخول
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // نفترض إنك خزنت التوكن هنا
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

