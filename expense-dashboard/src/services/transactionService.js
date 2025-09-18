import api from './api'; // نفس api اللي تستخدمه في users.js

// جلب كل الـ transactions
export const getTransactions = () => {
  return api.get('/transactions');
};

// إضافة transaction جديد
export const addTransaction = (data) => {
  // data = { amount, type, note, date, categoryId, projectId }
  const payload = {
    amount: parseFloat(data.amount),
    type: data.type,
    note: data.note,
    date: data.date,
    category: { id: parseInt(data.categoryId) },
    project: data.projectId ? { id: parseInt(data.projectId) } : null
  };
  return api.post('/transactions', payload);
};
