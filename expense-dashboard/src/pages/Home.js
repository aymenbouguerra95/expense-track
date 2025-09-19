import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import { getTransactions, getApprovals } from '../services/ApprovalsService';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [approvals, setApprovals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setUsers(await getUsers());
      setTransactions(await getTransactions());
      setApprovals(await getApprovals());
    };
    fetchData();
  }, []);

  const approvalStats = [
    { name: 'Pending', value: approvals.filter(a => a.status === 'Pending').length },
    { name: 'Approved', value: approvals.filter(a => a.status === 'Approved').length },
    { name: 'Rejected', value: approvals.filter(a => a.status === 'Rejected').length },
  ];

  const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

  const transactionsByMonth = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + t.amount;
    return acc;
  }, {});
  const barData = Object.keys(transactionsByMonth).map(m => ({ month: m, amount: transactionsByMonth[m] }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

      {/* Cards للإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Users</h3>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Transactions</h3>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Pending Approvals</h3>
          <p className="text-3xl font-bold">{approvalStats.find(a => a.name === 'Pending')?.value}</p>
        </div>
        <div className="p-4 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow-lg flex flex-col items-center justify-center">
          <h3 className="font-semibold text-lg">Rejected Approvals</h3>
          <p className="text-3xl font-bold">{approvalStats.find(a => a.name === 'Rejected')?.value}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4 text-gray-700">Approvals Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={approvalStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {approvalStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h3 className="font-semibold mb-4 text-gray-700">Transactions by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* آخر المعاملات */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Last 5 Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Currency</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(-5).reverse().map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{t.id}</td>
                  <td className="border px-4 py-2">{t.amount}</td>
                  <td className="border px-4 py-2">{t.currency}</td>
                  <td className="border px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* آخر الموافقات */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Last 5 Approvals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Transaction</th>
                <th className="border px-4 py-2">Approver</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Comment</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {approvals.slice(-5).reverse().map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{a.transaction?.id}</td>
                  <td className="border px-4 py-2">{a.approver?.username || a.approver?.email}</td>
                  <td className="border px-4 py-2">{a.status}</td>
                  <td className="border px-4 py-2">{a.comment || '-'}</td>
                  <td className="border px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Home;
