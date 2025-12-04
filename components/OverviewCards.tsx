import React from 'react';
import { DashboardStats } from '../types';
import { Wallet, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';

export const OverviewCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const percentageUsed = (stats.totalSpent / stats.totalBudget) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Budget</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalBudget)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-college-blue rounded-lg">
            <Wallet size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-college-blue h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Academic Year 2023-2024</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Utilized</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalSpent)}</h3>
          </div>
          <div className="p-3 bg-red-50 text-college-red rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-college-red h-full rounded-full" style={{ width: `${percentageUsed}%` }}></div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{percentageUsed.toFixed(1)}% of total budget</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Remaining</p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(stats.remainingBudget)}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full rounded-full" style={{ width: `${100 - percentageUsed}%` }}></div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Available for allocation</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-1">{stats.pendingApprovals}</h3>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <AlertCircle size={20} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Action Required</span>
        </div>
      </div>
    </div>
  );
};