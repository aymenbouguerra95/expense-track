import React, { useEffect, useState } from 'react';
import { getTransactions, addTransaction } from '../services/transactionService';
import api from '../services/api'; // لـ fetch categories/projects

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All', 'Income', 'Expense'
  const [form, setForm] = useState({
    amount: '',
    type: 'Income',
    note: '',
    date: '',
    categoryId: '',
    projectId: ''
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchProjects();
  }, []);

  const fetchTransactions = () => {
    getTransactions()
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }

  const fetchCategories = () => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }

  const fetchProjects = () => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = e => {
    e.preventDefault();
    addTransaction(form)
      .then(res => {
        alert('Transaction added!');
        setForm({ amount: '', type: 'Income', note: '', date: '', categoryId: '', projectId: '' });
        setShowForm(false);
        fetchTransactions();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to add transaction');
      });
  }

  // Filter transactions based on selected filter
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'All') return true;
    return transaction.type === filter;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and add button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Transaction
          </button>
        </div>

        {/* Add Transaction Form - Only show when showForm is true */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Add New Transaction</h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="number" 
                name="amount" 
                value={form.amount} 
                onChange={handleChange} 
                placeholder="Amount" 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              <select 
                name="type" 
                value={form.type} 
                onChange={handleChange} 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <input 
                type="text" 
                name="note" 
                value={form.note} 
                onChange={handleChange} 
                placeholder="Note" 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="date" 
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
              
              <select 
                name="categoryId" 
                value={form.categoryId} 
                onChange={handleChange} 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name} ({cat.type})</option>
                ))}
              </select>

              <select 
                name="projectId" 
                value={form.projectId} 
                onChange={handleChange} 
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project (Optional)</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>

              <div className="md:col-span-2 flex gap-3">
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-200 flex-1"
                >
                  Add Transaction
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['All', 'Income', 'Expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  filter === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {type}
                <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {type === 'All' 
                    ? transactions.length 
                    : transactions.filter(t => t.type === type).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {filter === 'All' ? 'All Transactions' : `${filter} Transactions`}
            </h2>
          </div>
          
          <div className="p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg">
                  {filter === 'All' 
                    ? 'No transactions yet. Start by adding your first transaction!'
                    : `No ${filter.toLowerCase()} transactions found.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map(tr => (
                  <div 
                    key={tr.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            tr.type === 'Income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tr.type}
                          </span>
                          <span className="text-xl font-bold text-gray-800">
                            {tr.type === 'Income' ? '+' : '-'}{tr.amount}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Category:</span> {tr.category?.name || '-'}
                          </div>
                          <div>
                            <span className="font-medium">Project:</span> {tr.project?.name || '-'}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(tr.date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {tr.note && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Note:</span> {tr.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;