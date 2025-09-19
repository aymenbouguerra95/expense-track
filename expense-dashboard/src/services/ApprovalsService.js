import api from './api';

// جلب جميع Approvals
export const getApprovals = async () => {
  try {
    const res = await api.get('/approvals');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch approvals', err);
    alert('فشل جلب الموافقات. تحقق من تسجيل الدخول أو صلاحياتك.');
    return [];
  }
};

// إنشاء Approval جديد
export const createApproval = async (data) => {
  try {
    const res = await api.post('/approvals', data);
    return res.data;
  } catch (err) {
    console.error('Failed to create approval', err);
    alert('فشل إنشاء الموافقة. تحقق من البيانات أو الصلاحيات.');
    return null;
  }
};

// تحديث Approval موجود
export const updateApproval = async (id, data) => {
  try {
    const res = await api.patch(`/approvals/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Failed to update approval', err);
    alert('فشل تحديث الموافقة.');
    return null;
  }
};

// حذف Approval
export const deleteApproval = async (id) => {
  try {
    await api.delete(`/approvals/${id}`);
  } catch (err) {
    console.error('Failed to delete approval', err);
    alert('فشل حذف الموافقة.');
  }
};

// جلب كل المعاملات
export const getTransactions = async () => {
  try {
    const res = await api.get('/transactions');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch transactions', err);
    alert('فشل جلب المعاملات.');
    return [];
  }
};

// جلب كل المستخدمين
export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch users', err);
    alert('فشل جلب المستخدمين. تحقق من تسجيل الدخول أو الصلاحيات.');
    return [];
  }
};
