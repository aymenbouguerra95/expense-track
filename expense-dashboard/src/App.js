import React, { useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Users from './pages/Users';
import Projects from './pages/Projects';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Approvals from './pages/Approvals';
import Home from './pages/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleLogin = () => setIsLoggedIn(true);

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  let PageComponent;
  switch(currentPage) {
    case 'users': PageComponent = <Users />; break;
    case 'projects': PageComponent = <Projects />; break;
    case 'budgets': PageComponent = <Budgets />; break;
    case 'transactions': PageComponent = <Transactions />; break;
    case 'categories': PageComponent = <Categories />; break;
    case 'approvals': PageComponent = <Approvals />; break;
    default: PageComponent = <Home />; break;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* AppBar */}
      <header className="bg-black/80 text-white p-4 flex items-center gap-x-4">
  {/* أيقونة همبرغر */}
  <button 
    onClick={() => setSidebarVisible(!sidebarVisible)}
    className="text-white text-2xl focus:outline-none"
  >
    &#9776;
  </button>

  
  <h1 className="text-xl font-bold">Expense Tracker Dashboard</h1>
</header>


<div style={{ display: 'flex', flex: 1 }}>
  
  <div
    className={`transition-transform duration-300`} 
    style={{
      transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)', 
      width: '250px',
      minWidth: '250px',
    }}
  >
    <Sidebar onSelect={setCurrentPage} />
  </div>

  {/* Main content */}
  <main style={{ padding: '1rem', flex: 1 }}>
    {PageComponent}
  </main>
</div>


      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 mt-auto">
        &copy; 2025 My Expense Tracker
      </footer>
    </div>
  );
}

export default App;
