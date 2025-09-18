import api from './api';

// جلب كل التصنيفات
export const fetchCategories = () => api.get('/categories');

// إضافة تصنيف جديد
export const addCategory = (data) => api.post('/categories', data);

// تعديل تصنيف
export const updateCategory = (id, data) => api.patch(`/categories/${id}`, data);

// حذف تصنيف
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
