
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, AlertTriangle, Check, X } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ExpenseStatusBadge } from "@/components/expenses/ExpenseStatusBadge";
import { getAuditLogs } from "@/services/audit.service";
import ActionButtons from "./ActionButtons"; // Client Component for actions

async function getExpenseDetails(id: string) {
    const expense = await db.expense.findUnique({
        where: { id },
        include: {
            category: true,
            submittedBy: { select: { name: true, email: true, department: true } },
            approvedBy: { select: { name: true } }
        }
    });
    return expense;
}

export default async function ExpenseDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const expense = await getExpenseDetails(params.id);

  if (!expense) {
      return <div>Expense not found</div>;
  }

  const logs = await getAuditLogs(params.id);
  const canApprove = session.user.role !== 'STAFF' && expense.status === 'PENDING';

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/expenses" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors w-fit">
                <ArrowLeft size={18} />
                Back to Expenses
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{expense.description}</h1>
                        <ExpenseStatusBadge status={expense.status} />
                    </div>
                    <p className="text-slate-500">Expense ID: {expense.id}</p>
                </div>
                
                {canApprove && (
                    <div className="flex gap-2">
                        <ActionButtons expenseId={expense.id} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Details</h2>
                        <div className="grid grid-cols-2 gap-y-6">
                             <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Amount</label>
                                <p className="text-xl font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Vendor</label>
                                <p className="text-lg text-slate-900">{expense.vendor}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Date Incurred</label>
                                <div className="flex items-center gap-2 text-slate-900 mt-1">
                                    <Calendar size={16} className="text-slate-400" />
                                    {formatDate(expense.date)}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Activity Type</label>
                                <div className="flex items-center gap-2 text-slate-900 mt-1">
                                    <Tag size={16} className="text-slate-400" />
                                    {expense.activityType}
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                                <p className="text-slate-900 mt-1">{expense.category.name}</p>
                            </div>
                        </div>

                         {expense.rejectionReason && (
                            <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
                                    <AlertTriangle size={18} />
                                    Rejection Reason
                                </div>
                                <p className="text-red-600">{expense.rejectionReason}</p>
                            </div>
                        )}
                    </div>

                     {expense.receiptUrl && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Receipt</h2>
                             <iframe src={expense.receiptUrl} className="w-full h-96 rounded-lg border border-slate-100 bg-slate-50" />
                             <div className="mt-4 text-right">
                                 <a href={expense.receiptUrl} target="_blank" className="text-college-blue font-medium hover:underline">Download / Open in New Tab</a>
                             </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                         <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">User Info</h2>
                         <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 uppercase">Submitted By</label>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{expense.submittedBy.name}</p>
                                        <p className="text-xs text-slate-500">{expense.submittedBy.email}</p>
                                    </div>
                                </div>
                            </div>
                            {expense.approvedBy && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-400 uppercase">Approved By</label>
                                    <p className="text-sm font-medium text-green-700 mt-1">{expense.approvedBy.name}</p>
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                         <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Audit Log</h2>
                         <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                             {logs.map((log) => (
                                 <div key={log.id} className="text-sm border-l-2 border-slate-200 pl-3 py-1">
                                     <p className="font-medium text-slate-900">{log.action.replace('EXPENSE_', '')}</p>
                                     <p className="text-xs text-slate-500">{formatDate(log.createdAt)} by {log.performedBy.name}</p>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
