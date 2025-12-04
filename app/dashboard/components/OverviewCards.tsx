"use client";

import { DashboardStats } from "@/types";
import { Wallet, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OverviewCards = ({ stats }: { stats: DashboardStats }) => {
  const percentageUsed = stats.totalBudget > 0 ? (stats.totalSpent / stats.totalBudget) * 100 : 0;

  const StatCard = ({ title, value, icon: Icon, colorClass, desc, progress }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <div className={`p-2 rounded-full ${colorClass.bg}`}>
            <Icon className={`h-4 w-4 ${colorClass.text}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {progress && (
             <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`${colorClass.bar} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
             </div>
        )}
        <p className="text-xs text-muted-foreground mt-2">{desc}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Budget"
        value={formatCurrency(stats.totalBudget)}
        icon={Wallet}
        colorClass={{ bg: 'bg-blue-50', text: 'text-college-blue', bar: 'bg-college-blue' }}
        desc="Academic Year Allocation"
        progress={100}
      />
      <StatCard 
        title="Total Spent"
        value={formatCurrency(stats.totalSpent)}
        icon={TrendingDown}
        colorClass={{ bg: 'bg-red-50', text: 'text-college-red', bar: 'bg-college-red' }}
        desc={`${percentageUsed.toFixed(1)}% of budget utilized`}
        progress={percentageUsed}
      />
      <StatCard 
        title="Remaining"
        value={formatCurrency(stats.remainingBudget)}
        icon={CheckCircle2}
        colorClass={{ bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-600' }}
        desc="Available funds"
        progress={100 - percentageUsed}
      />
      <StatCard 
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={AlertCircle}
        colorClass={{ bg: 'bg-orange-50', text: 'text-orange-600' }}
        desc="Requires immediate attention"
      />
    </div>
  );
};