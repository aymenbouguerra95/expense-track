import React, { useEffect, useState } from "react";
import {
  getApprovals,
  createApproval,
  updateApproval,
  deleteApproval,
  getTransactions,
  getUsers,
} from "../services/ApprovalsService";

function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    transactionId: "",
    approverId: "",
    status: "Pending",
    comment: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadApprovals();
    loadTransactions();
    loadUsers();
  }, []);

  const loadApprovals = async () => setApprovals(await getApprovals());
  const loadTransactions = async () => setTransactions(await getTransactions());
  const loadUsers = async () => setUsers(await getUsers());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateApproval(editingId, formData);
    } else {
      await createApproval(formData);
    }
    setFormData({ transactionId: "", approverId: "", status: "Pending", comment: "" });
    setEditingId(null);
    loadApprovals();
  };

  const handleEdit = (approval) => {
    setFormData({
      transactionId: approval.transaction?.id || "",
      approverId: approval.approver?.id || "",
      status: approval.status,
      comment: approval.comment || "",
    });
    setEditingId(approval.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف الموافقة؟')) return;
    await deleteApproval(id);
    setApprovals(approvals.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Approvals</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.transactionId}
            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Transaction</option>
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} - {t.amount} {t.currency}
              </option>
            ))}
          </select>

          <select
            value={formData.approverId}
            onChange={(e) => setFormData({ ...formData, approverId: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Approver</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          {editingId ? "Update Approval" : "Add Approval"}
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Transaction</th>
            <th className="border px-4 py-2">Approver</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Comment</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.transaction?.id}</td>
              <td className="border px-4 py-2">{a.approver?.username || a.approver?.email}</td>
              <td className="border px-4 py-2">{a.status}</td>
              <td className="border px-4 py-2">{a.comment || "-"}</td>
              <td className="border px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2 space-x-2">
                <button onClick={() => handleEdit(a)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(a.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Approvals;
