import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      department?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: Role
    department?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    department?: string
  }
}

export type DashboardStats = {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  pendingApprovals: number
  categoryUtilization: { name: string; allocated: number; spent: number }[]
  monthlyTrend: { name: string; amount: number }[]
  recentExpenses: any[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}