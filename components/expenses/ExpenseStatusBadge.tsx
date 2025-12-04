
import React from 'react';
import { cn } from '@/lib/utils';

export const ExpenseStatusBadge = ({ status }: { status: string }) => {
    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            status === 'APPROVED' && "bg-green-50 text-green-700 border-green-200",
            status === 'PENDING' && "bg-orange-50 text-orange-700 border-orange-200",
            status === 'REJECTED' && "bg-red-50 text-red-700 border-red-200"
        )}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};
