
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getCurrentBudget } from "@/services/budget.service";
import { Wallet, Plus } from "lucide-react";

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const budget = await getCurrentBudget();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Budget Planning</h1>
                    <p className="text-slate-500">Manage annual allocations and track category limits.</p>
                </div>
                {session.user.role === 'ADMIN' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-college-blue text-white rounded-lg hover:bg-blue-900 transition-colors">
                        <Plus size={18} />
                        New Budget Plan
                    </button>
                )}
            </div>

            {budget ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budget.categories.map((cat: any) => {
                        // Calculate spent from included approved expenses if available, or fetch separate
                        const spent = cat.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
                        const percentage = (spent / cat.allocated) * 100;
                        
                        return (
                            <div key={cat.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-slate-900">{cat.name}</h3>
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <Wallet size={18} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500">Allocated</span>
                                            <span className="font-medium">₹{cat.allocated.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500">Spent</span>
                                            <span className="font-medium text-red-600">₹{spent.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-college-blue'}`} 
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">{percentage.toFixed(1)}% used</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-500">No active budget found for this academic year.</p>
                    {session.user.role === 'ADMIN' && (
                        <button className="mt-4 text-college-blue font-medium hover:underline">Create Budget Plan</button>
                    )}
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
