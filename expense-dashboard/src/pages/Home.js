import React from 'react';

function Home() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Bienvenue à Expense Tracker Dashboard
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            هنا يمكنك متابعة المستخدمين، المشاريع، المصاريف وغيرها.
          </p>
          <h1 className="text-4xl font-bold text-red-600">Hello Tailwind!</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;