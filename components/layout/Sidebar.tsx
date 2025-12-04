"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, Receipt, FileText, Landmark, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export const Sidebar = ({ user }: { user: any }) => {
  const pathname = usePathname();

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/budget", label: "Budget Plan", icon: PieChart },
    { href: "/reports", label: "Reports", icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="h-16 flex items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-2 text-college-red font-bold text-xl">
          <Landmark size={28} />
          <span>DeptBudget</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {routes.map((route) => (
            <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium",
                    pathname.startsWith(route.href) 
                    ? "bg-college-blue text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-college-blue"
                )}
            >
                <route.icon size={20} className={cn(pathname.startsWith(route.href) ? "text-white" : "text-slate-500 group-hover:text-college-blue")} />
                {route.label}
            </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4 py-2 bg-slate-50 rounded-lg">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-college-red hover:bg-red-50 rounded-lg w-full transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};