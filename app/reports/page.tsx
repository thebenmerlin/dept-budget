
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const reports = [
    { title: 'Annual Budget Report', type: 'PDF', desc: 'Comprehensive summary of yearly allocations.', url: '/api/reports/pdf' },
    { title: 'Expense Audit Log', type: 'Excel', desc: 'Detailed line-item export of all expenses.', url: '/api/reports/excel' },
    { title: 'NBA/NAAC Utilization', type: 'PDF', desc: 'Formatted specifically for accreditation compliance.', url: '/api/reports/pdf' }, // Reuse for demo
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={session.user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
                <p className="text-slate-500">Generate standard reports for administration and audits.</p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${report.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {report.type === 'PDF' ? <FileText size={24} /> : <FileSpreadsheet size={24} />}
                    </div>
                    <span className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">{report.type}</span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{report.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{report.desc}</p>
                  </div>

                  <a 
                    href={report.url}
                    download
                    className="w-full py-2.5 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    <Download size={18} />
                    Download Report
                  </a>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
