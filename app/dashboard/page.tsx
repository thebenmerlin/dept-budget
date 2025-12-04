
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/services/dashboard.service";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { OverviewCards } from "./components/OverviewCards";
import { CategoryChart } from "./components/CategoryChart";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Role-based Redirects if separate pages existed, but here we can render conditionally or redirect to specific sub-folders
  if (session.user.role === 'ADMIN') {
      // If we had a specific admin page structure: redirect("/dashboard/admin");
      // For now, we enhance the main dashboard
  }

  const stats = await getDashboardStats();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={session.user} />
      
      <div className="flex-1 flex flex-col ml-64">
        <Navbar user={session.user} />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500">
                {session.user.role === 'ADMIN' && "Administration Overview"}
                {session.user.role === 'HOD' && "Departmental Overview"}
                {session.user.role === 'STAFF' && "My Expenses Overview"}
              </p>
            </div>
            {session.user.role === 'ADMIN' && (
                <div className="bg-blue-50 text-college-blue px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                    ADMIN MODE
                </div>
            )}
          </div>

          <OverviewCards stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-4">
                 <CategoryChart data={stats.categoryUtilization} />
            </div>
            
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentExpenses.length === 0 ? (
                      <p className="text-sm text-slate-500">No recent transactions.</p>
                  ) : (
                    stats.recentExpenses.map((exp: any) => (
                        <div key={exp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex flex-col">
                                <span className="font-medium text-sm text-slate-900 truncate max-w-[150px]">{exp.description}</span>
                                <span className="text-xs text-slate-500">{formatDate(exp.date)} • {exp.submittedBy.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-sm">{formatCurrency(exp.amount)}</div>
                                <ExpenseStatusBadge status={exp.status} />
                            </div>
                        </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
