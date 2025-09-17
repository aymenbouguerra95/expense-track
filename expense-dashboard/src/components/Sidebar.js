import React from 'react';

function Sidebar({ onSelect }) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-lg h-full">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Menu</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => onSelect('home')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Accueil
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('users')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Users
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('projects')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Projects
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('budgets')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Budgets
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('transactions')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Transactions
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('categories')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Categories
            </button>
          </li>
          <li>
            <button 
              onClick={() => onSelect('approvals')}
              className="w-full text-left px-4 py-3 rounded-lg text-gray-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
            >
              Approvals
            </button>
          </li>
        </ul>
        <button 
          onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
          className="w-full mt-8 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;