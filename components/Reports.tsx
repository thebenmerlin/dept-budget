import React from 'react';
import { FileText, FileSpreadsheet, Download } from 'lucide-react';

export const Reports: React.FC = () => {
  const reports = [
    { title: 'Annual Budget Report', type: 'PDF', desc: 'Comprehensive summary of yearly allocations and spending.' },
    { title: 'Expense Audit Log', type: 'Excel', desc: 'Detailed line-item export of all expenses for auditing.' },
    { title: 'NBA/NAAC Utilization', type: 'PDF', desc: 'Formatted specifically for accreditation compliance documentation.' },
    { title: 'Category-wise Breakdown', type: 'Excel', desc: 'Spending analysis grouped by budget categories.' },
  ];

  return (
    <div className="space-y-6">
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

            <button 
              onClick={() => alert(`Generating ${report.title}...`)}
              className="w-full py-2.5 border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              <Download size={18} />
              Download Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};