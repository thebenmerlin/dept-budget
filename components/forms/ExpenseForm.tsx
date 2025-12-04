
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { expenseSchema } from '@/validations/expense.schema';
import { z } from 'zod';

interface Category {
  id: string;
  name: string;
  remaining: number;
}

export const ExpenseForm = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    vendor: '',
    activityType: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(data => {
        if(Array.isArray(data)) setCategories(data);
    }).catch(err => {
      console.error("Failed to fetch categories");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
        const validation = expenseSchema.safeParse(formData);
        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            validation.error.issues.forEach(issue => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            toast.error("Please check the form for errors");
            setIsLoading(false);
            return;
        }

      let receiptUrl = '';
      
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) throw new Error('File upload failed');
        const uploadJson = await uploadRes.json();
        receiptUrl = uploadJson.url;
      }

      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          receiptUrl
        })
      });

      if (!res.ok) throw new Error('Failed to create expense');
      
      toast.success('Expense submitted successfully');
      router.push('/expenses');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Expenses
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit New Expense</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-slate-700">Expense Title</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lab Equipment Maintenance"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.description ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vendor Name</label>
              <input
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="e.g., Dell Computers"
                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.vendor ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              />
              {errors.vendor && <p className="text-xs text-red-500">{errors.vendor}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount (INR)</label>
              <input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.amount ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all ${errors.date ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all bg-white ${errors.categoryId ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Rem: ₹{c.remaining?.toLocaleString() ?? 0})
                  </option>
                ))}
              </select>
               {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Activity Type</label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                 className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all bg-white ${errors.activityType ? 'border-red-500 ring-red-200' : 'border-slate-200 focus:ring-college-blue/20 focus:border-college-blue'}`}
              >
                <option value="">Select Activity</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="SOFTWARE">Software</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="FDP">FDP</option>
                <option value="EXPERT_TALK">Expert Talk</option>
                <option value="STATIONARY">Stationary</option>
                <option value="STUDENT_ACTIVITY">Student Activity</option>
                <option value="MISC">Miscellaneous</option>
              </select>
               {errors.activityType && <p className="text-xs text-red-500">{errors.activityType}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Upload Receipt</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="image/*,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto text-slate-400 group-hover:text-college-blue mb-2 transition-colors" size={32} />
              <p className="text-sm text-slate-600 font-medium">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-college-blue text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Submit Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
