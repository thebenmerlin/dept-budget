"use client";

import { Bell, Search } from "lucide-react";

export const Navbar = ({ user }: { user: any }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-college-blue/20 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-college-red rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 rounded-full bg-college-blue text-white flex items-center justify-center font-bold text-sm">
            {user.name?.[0]}
        </div>
      </div>
    </header>
  );
};