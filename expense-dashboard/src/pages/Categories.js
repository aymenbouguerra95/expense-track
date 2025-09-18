import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../services/categories';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('Expense');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('All'); // Filter state

  // جلب التصنيفات
  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    return filter === 'All' || cat.type === filter;
  });

  // إضافة أو تعديل
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // تعديل
      updateCategory(editingId, { name, type })
        .then(res => {
          setCategories(categories.map(cat => (cat.id === editingId ? res.data : cat)));
          setEditingId(null);
          setName('');
          setType('Expense');
        })
        .catch(err => console.error(err));
    } else {
      // إضافة
      addCategory({ name, type })
        .then(res => {
          setCategories([...categories, res.data]);
          setName('');
          setType('Expense');
        })
        .catch(err => console.error(err));
    }
  };

  // حذف
  const handleDelete = (id) => {
    deleteCategory(id)
      .then(() => setCategories(categories.filter(cat => cat.id !== id)))
      .catch(err => console.error(err));
  };

  // Edit mode
  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setType(cat.type);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setType('Expense');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">📂</span> 
              Categories Management
            </h1>
            <p className="text-blue-100 mt-2">Manage your income and expense categories</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Income Categories</p>
                    <p className="text-2xl font-bold">{categories.filter(c => c.type === 'Income').length}</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Expense Categories</p>
                    <p className="text-2xl font-bold">{categories.filter(c => c.type === 'Expense').length}</p>
                  </div>
                  <div className="text-3xl">💸</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </div>
            </div>

            {/* Add/Edit Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingId ? '✏️ Edit Category' : '➕ Add New Category'}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input 
                      type="text"
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    >
                      <option value="Income">💰 Income</option>
                      <option value="Expense">💸 Expense</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button 
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      {editingId ? '✅ Update' : '➕ Add'}
                    </button>
                    {editingId && (
                      <button 
                        onClick={cancelEdit}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">📋 Categories List</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('All')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    filter === 'All' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  📊 All ({categories.length})
                </button>
                <button
                  onClick={() => setFilter('Income')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    filter === 'Income' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  💰 Income ({categories.filter(c => c.type === 'Income').length})
                </button>
                <button
                  onClick={() => setFilter('Expense')}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    filter === 'Expense' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  💸 Expense ({categories.filter(c => c.type === 'Expense').length})
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-3">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-xl font-medium">No categories found</p>
                  <p className="text-gray-400">Add your first category to get started</p>
                </div>
              ) : (
                filteredCategories.map(cat => (
                  <div key={cat.id} className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    editingId === cat.id 
                      ? 'border-blue-400 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          cat.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className="text-xl">
                            {cat.type === 'Income' ? '💰' : '💸'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{cat.name}</h3>
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            cat.type === 'Income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cat.type === 'Income' ? '⬆️' : '⬇️'} {cat.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;