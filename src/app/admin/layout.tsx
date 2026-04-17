import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminNavControl } from "@/components/layout/AdminNavControl";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as any)?.role;

  if (userRole !== "SUPER_ADMIN" && userRole !== "ORGANIZER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Navigation Controller (Handles Sidebar/Header/Mobile Drawer) */}
      <AdminNavControl user={session.user} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-12 overflow-x-hidden pt-6 md:pt-12">
        <div className="max-w-[1600px] mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
