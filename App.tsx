import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseForm } from './components/ExpenseForm';
import { Auth } from './components/Auth';
import { Reports } from './components/Reports';
import { User } from './types';
import { mockService } from './services/mockService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (email: string) => {
    const user = await mockService.login(email);
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList user={user} />} />
          <Route path="/expenses/new" element={<ExpenseForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/budget" element={
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Budget Planning</h2>
              <p className="text-slate-500 mt-2">This module is available for Admins only in the full version.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}