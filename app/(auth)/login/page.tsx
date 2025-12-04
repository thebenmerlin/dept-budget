"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema } from "@/validations/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Basic client validation
    const result = loginSchema.safeParse(data);
    if (!result.success) {
        // ZodError uses issues in newer versions or strict types
        toast.error(result.error.issues[0].message);
        setLoading(false);
        return;
    }

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-college-blue p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Landmark className="text-white h-6 w-6" />
            </div>
          <h1 className="text-2xl font-bold text-white">DeptBudget</h1>
          <p className="text-blue-200 mt-2 text-sm">Sign in to your account</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-college-blue/20 outline-none border-slate-200"
                placeholder="email@college.edu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-college-blue/20 outline-none border-slate-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-college-red text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
            </button>
          </form>
          
           <div className="mt-6 text-center text-xs text-slate-400">
            <p>Demo Credentials:</p>
            <p>admin@college.edu / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}