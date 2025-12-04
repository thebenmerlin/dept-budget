
"use client";

import React, { useState } from 'react';
import { Plus, Search, Check, X, ExternalLink, Eye, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExpenseStatusBadge } from './ExpenseStatusBadge';

interface ExpenseListProps {
  expenses: any[];
  userRole: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, userRole }) => {
  const router = useRouter();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Rejection Modal State
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleStatusUpdate = async (id: string, newStatus: string, reason?: string) => {
    setIsProcessing(id);
    try {
      const body = { 
          status: newStatus, 
          rejectionReason: reason 
      };

      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData || 'Failed to update status');
      }
      
      toast.success(`Expense ${newStatus.toLowerCase()} successfully`);
      setRejectingId(null);
      setRejectionReason("");
      router.refresh(); // Refresh server components
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsProcessing(null);
    }
  };

  const confirmRejection = () => {
      if (!rejectingId) return;
      if (!rejectionReason.trim()) {
          toast.error("Please provide a reason for rejection");
          return;
      }
      handleStatusUpdate(rejectingId, 'REJECTED', rejectionReason);
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
        <Link href="/expenses/new" className="flex items-center gap-2 px-4 py-2 bg-college-red text-white rounded-lg hover:bg-red-900 transition-colors shadow-sm font-medium">
          <Plus size={18} />
          New Expense
        </Link>
      </div>

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
                    <div className="text-slate-900">{expense.category.name}</div>
                    <div className="text-xs text-slate-500">{expense.activityType}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(expense.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-700">{expense.submittedBy.name}</div>
                  </td>
                  <td className="px-6 py-4">
                     <ExpenseStatusBadge status={expense.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link 
                        href={`/expenses/view/${expense.id}`}
                        className="p-2 text-slate-400 hover:text-college-blue hover:bg-blue-50 rounded-lg transition-colors" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>

                      {expense.receiptUrl && (
                        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-college-blue hover:bg-blue-50 rounded-lg transition-colors" title="View Receipt">
                          <ExternalLink size={18} />
                        </a>
                      )}
                      
                      {userRole !== 'STAFF' && expense.status === 'PENDING' && (
                        <>
                          <button 
                            type="button"
                            disabled={isProcessing === expense.id}
                            onClick={() => handleStatusUpdate(expense.id, 'APPROVED')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50" 
                            title="Approve"
                          >
                             {isProcessing === expense.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                          </button>
                          <button 
                            type="button"
                            disabled={isProcessing === expense.id}
                            onClick={() => setRejectingId(expense.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
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

      {/* Rejection Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle size={24} />
                    <h3 className="text-lg font-bold">Reject Expense</h3>
                </div>
                <p className="text-slate-600 mb-4">Please provide a reason for rejecting this expense. This will be visible to the staff member.</p>
                <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
                    placeholder="Reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    autoFocus
                ></textarea>
                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        type="button"
                        onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={confirmRejection}
                        disabled={isProcessing === rejectingId}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                    >
                         {isProcessing === rejectingId ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
