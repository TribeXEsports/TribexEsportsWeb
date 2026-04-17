import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session || (role !== "CAPTAIN" && role !== "PLAYER")) {
    // If Super Admin/Organizer, they might be testing, but usually stay in their dashboard
    if (role === "SUPER_ADMIN" || role === "ORGANIZER") {
        // Allow? 
    } else {
        redirect("/login");
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#050505] text-white">
      {/* Background Glows for consistent esports polish */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] size-[600px] bg-red-600/10 blur-[140px] rounded-full opacity-30" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[600px] bg-blue-600/5 blur-[140px] rounded-full opacity-20" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {children}
      </div>
    </div>
  );
}
