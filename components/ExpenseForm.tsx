import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockService } from '../services/mockService';
import { Category } from '../types';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

export const ExpenseForm: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    vendor: '',
    activityType: '',
    date: new Date().toISOString().split('T')[0],
    submittedBy: 'Current User' // In real app, comes from auth context
  });

  useEffect(() => {
    mockService.getCategories().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await mockService.addExpense({
        description: formData.description,
        amount: Number(formData.amount),
        categoryId: formData.categoryId,
        vendor: formData.vendor,
        activityType: formData.activityType,
        date: formData.date,
        submittedBy: formData.submittedBy
      });
      navigate('/expenses');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Expenses
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit New Expense</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Expense Title</label>
              <input
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lab Equipment Maintenance"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Vendor Name</label>
              <input
                required
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                placeholder="e.g., Dell Computers"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Amount (INR)</label>
              <input
                required
                type="number"
                name="amount"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all bg-white"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name} (Available: ₹{c.remaining.toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Activity Type</label>
              <select
                required
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-college-blue/20 focus:border-college-blue outline-none transition-all bg-white"
              >
                <option value="">Select Activity</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Software">Software</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Consumables">Consumables</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Upload Receipt</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
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