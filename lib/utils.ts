import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { APP_CONFIG } from "@/constants/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined) {
  const val = amount || 0;
  return new Intl.NumberFormat(APP_CONFIG.locale, {
    style: "currency",
    currency: APP_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatDate(date: Date | string) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString(APP_CONFIG.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}