import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Landmark, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex justify-center">
            <div className="bg-college-blue p-4 rounded-2xl shadow-lg">
                <Landmark className="text-white h-12 w-12" />
            </div>
        </div>
        <h1 className="text-4xl font-bold text-college-blue">
          Smart Department Budget Management
        </h1>
        <p className="text-xl text-slate-600">
          Streamline your department's financial planning, expense tracking, and analytics with our enterprise-grade solution.
        </p>
        
        <div className="flex justify-center gap-4 pt-4">
          <Link 
            href="/login" 
            className="flex items-center gap-2 bg-college-red hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Access Portal <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}