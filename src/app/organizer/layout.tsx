import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const userRole = (session.user as any)?.role;

  if (userRole !== "ORGANIZER" && userRole !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* We can reuse the AdminSidebar but pass simplified links later if needed */}
      <AdminSidebar user={session.user} />

      <main className="flex-1 p-6 md:p-12 overflow-x-hidden pt-24 md:pt-12">
        {children}
      </main>
    </div>
  );
}
