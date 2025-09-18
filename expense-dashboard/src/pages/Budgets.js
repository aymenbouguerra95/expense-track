import React, { useEffect, useState } from 'react';
import { getBudgets, createBudget, deleteBudget, getCategories, getProjects, getUsers } from '../services/budgetService';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    project: '',
    user: '',
    period: '',
    minAmount: '',
    maxAmount: ''
  });

  const [form, setForm] = useState({
    amount: '',
    period: '',
    categoryId: '',
    projectId: '',
    userId: ''
  });

  useEffect(() => {
    fetchBudgets();
    fetchDropdowns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [budgets, filters]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await getBudgets();
      setBudgets(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching budgets');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [catRes, projRes, userRes] = await Promise.all([
        getCategories(),
        getProjects(),
        getUsers()
      ]);
      setCategories(catRes.data || []);
      setProjects(projRes.data || []);
      setUsers(userRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let filtered = budgets;

    // Search filter (searches in category, project, user names)
    if (filters.search) {
      filtered = filtered.filter(budget => 
        budget.category?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        budget.project?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        budget.user?.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(budget => 
        budget.category?.id?.toString() === filters.category
      );
    }

    // Project filter
    if (filters.project) {
      filtered = filtered.filter(budget => 
        budget.project?.id?.toString() === filters.project
      );
    }

    // User filter
    if (filters.user) {
      filtered = filtered.filter(budget => 
        budget.user?.id?.toString() === filters.user
      );
    }

    // Period filter
    if (filters.period) {
      filtered = filtered.filter(budget => 
        budget.period === filters.period
      );
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(budget => 
        parseFloat(budget.amount) >= parseFloat(filters.minAmount)
      );
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(budget => 
        parseFloat(budget.amount) <= parseFloat(filters.maxAmount)
      );
    }

    setFilteredBudgets(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.amount || !form.period || !form.categoryId) {
      alert('Please fill all required fields');
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      projectId: form.projectId ? Number(form.projectId) : undefined,
      userId: form.userId ? Number(form.userId) : undefined,
      amount: Number(form.amount)
    };

    try {
      await createBudget(payload);
      fetchBudgets();
      setForm({ amount: '', period: '', categoryId: '', projectId: '', userId: '' });
      setShowForm(false);
      alert('Budget added successfully!');
    } catch (err) {
      console.error(err);
      alert('Error adding budget');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteBudget(id);
      fetchBudgets();
    } catch (err) {
      console.error(err);
      alert('Error deleting budget');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      project: '',
      user: '',
      period: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPeriodColor = (period) => {
    const colors = {
      'Monthly': 'bg-blue-100 text-blue-800',
      'Weekly': 'bg-green-100 text-green-800',
      'Yearly': 'bg-purple-100 text-purple-800'
    };
    return colors[period] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Management</h1>
            <p className="text-gray-600">Manage and track your budgets effectively</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {showForm ? '✕ Cancel' : '+ Add Budget'}
          </button>
        </div>

        {/* Add Budget Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Budget</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
                <select
                  value={form.period}
                  onChange={e => setForm({ ...form, period: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Period</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={form.projectId}
                  onChange={e => setForm({ ...form, projectId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">None</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <select
                  value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">None</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? 'Adding...' : 'Add Budget'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Filter Budgets</h2>
            <button
              onClick={clearFilters}
              className="mt-2 md:mt-0 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by category, project, or user..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={filters.period}
                onChange={e => setFilters({ ...filters, period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Periods</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={filters.project}
                onChange={e => setFilters({ ...filters, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
              <input
                type="number"
                placeholder="Min amount"
                value={filters.minAmount}
                onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
              <input
                type="number"
                placeholder="Max amount"
                value={filters.maxAmount}
                onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
              <select
                value={filters.user}
                onChange={e => setFilters({ ...filters, user: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Users</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredBudgets.length}</span> of <span className="font-semibold text-gray-900">{budgets.length}</span> budgets
            </p>
            <p className="text-gray-600 mt-2 md:mt-0">
              Total Amount: <span className="font-semibold text-green-600">
                {formatAmount(filteredBudgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0))}
              </span>
            </p>
          </div>
        </div>

        {/* Budget List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBudgets.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">💰</div>
                <p className="text-gray-500 text-lg">No budgets found matching your criteria</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or add a new budget</p>
              </div>
            ) : (
              filteredBudgets.map(budget => (
                <div key={budget.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {formatAmount(budget.amount)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPeriodColor(budget.period)}`}>
                        {budget.period}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="ml-2 font-medium text-gray-900">{budget.category?.name}</span>
                      </div>
                      
                      {budget.project && (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <span className="text-sm text-gray-600">Project:</span>
                          <span className="ml-2 font-medium text-gray-900">{budget.project.name}</span>
                        </div>
                      )}
                      
                      {budget.user && (
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                          <span className="text-sm text-gray-600">User:</span>
                          <span className="ml-2 font-medium text-gray-900">{budget.user.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      Delete Budget
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Budgets;