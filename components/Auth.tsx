import React, { useState } from 'react';
import { Landmark, ArrowRight, Loader2 } from 'lucide-react';

export const Auth: React.FC<{ onLogin: (email: string) => Promise<void> }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(email);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-college-blue p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Landmark className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">DeptBudget</h1>
          <p className="text-blue-200 text-sm mt-2">Smart Financial Management for Departments</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-college-red text-white py-3 rounded-lg font-bold hover:bg-red-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 uppercase font-semibold mb-4">Quick Demo Logins</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setEmail('hod@college.edu')} className="text-xs bg-slate-50 hover:bg-slate-100 py-2 rounded text-slate-600 border border-slate-200">HOD</button>
              <button onClick={() => setEmail('staff@college.edu')} className="text-xs bg-slate-50 hover:bg-slate-100 py-2 rounded text-slate-600 border border-slate-200">Staff</button>
              <button onClick={() => setEmail('admin@college.edu')} className="text-xs bg-slate-50 hover:bg-slate-100 py-2 rounded text-slate-600 border border-slate-200">Admin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};