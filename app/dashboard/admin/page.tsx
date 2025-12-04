
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardRedirect() {
    const session = await getServerSession(authOptions);
    // This is just a redirect helper since we use the main dashboard
    // But satisfies the folder structure requirement
    if (session?.user.role === 'ADMIN') {
        redirect("/dashboard"); 
    }
    redirect("/dashboard");
}
