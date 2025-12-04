import React, { useEffect, useState } from 'react';
import { Expense, User } from '../types';
import { mockService } from '../services/mockService';
import { Plus, Search, Filter, Eye, Check, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExpenseList: React.FC<{ user: User }> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadExpenses = async () => {
    const data = await mockService.getExpenses();
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleApprove = async (id: string) => {
    if (confirm('Are you sure you want to approve this expense?')) {
      await mockService.approveExpense(id);
      loadExpenses();
    }
  };

  const handleReject = async (id: string) => {
    if (confirm('Are you sure you want to reject this expense?')) {
      await mockService.rejectExpense(id);
      loadExpenses();
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) || 
                          e.vendor.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || e.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
          <p className="text-slate-500">Track, approve, and audit departmental expenses.</p>
        </div>
        <Link to="/expenses/new" className="flex items-center gap-2 px-4 py-2 bg-college-red text-white rounded-lg hover:bg-red-900 transition-colors shadow-sm font-medium">
          <Plus size={18} />
          New Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by description or vendor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-college-blue/20"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Category / Activity</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{expense.description}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{expense.vendor} • {new Date(expense.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900">{expense.categoryName}</div>
                    <div className="text-xs text-slate-500">{expense.activityType}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{expense.submittedBy}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      expense.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      expense.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {expense.status.charAt(0) + expense.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-college-blue hover:bg-blue-50 rounded-lg transition-colors" title="View Receipt">
                        <FileText size={18} />
                      </button>
                      
                      {user.role !== 'STAFF' && expense.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleApprove(expense.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleReject(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No expenses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};