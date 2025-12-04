"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ActionButtons({ expenseId }: { expenseId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (status: string, reason?: string) => {
    setIsLoading(true);
    try {
      if (status === 'REJECTED' && !reason) {
          reason = prompt("Enter rejection reason:");
          if (!reason) {
              setIsLoading(false);
              return;
          }
      }

      const res = await fetch(`/api/expenses/${expenseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: reason })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Update failed');
      }
      
      toast.success(`Expense ${status.toLowerCase()}`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
        <button 
            disabled={isLoading}
            onClick={() => handleUpdate('APPROVED')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            Approve
        </button>
        <button 
            disabled={isLoading}
            onClick={() => handleUpdate('REJECTED')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
             {isLoading ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
            Reject
        </button>
    </div>
  );
}