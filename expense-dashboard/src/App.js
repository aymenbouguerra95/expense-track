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
    <div style={{ display: 'flex' }}>
      <Sidebar onSelect={setCurrentPage} />
      <main style={{ padding: '1rem', flex: 1 }}>
        {PageComponent}
      </main>
    </div>
  );
}

export default App;
