
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ExpenseForm } from "@/components/forms/ExpenseForm";

export default async function NewExpensePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <ExpenseForm />
          </div>
        </main>
      </div>
    </div>
  );
}
