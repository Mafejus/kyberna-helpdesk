"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Ticket, Users, GraduationCap, LogOut, Menu, UserCircle, Calendar, FileText, Settings, ClipboardCheck, Projector } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ChangePasswordDialog } from "@/components/dialogs/ChangePasswordDialog";
import { KeyRound } from "lucide-react";

// Simplified mobile menu for now without full Sheet component to save tokens/files, or I can implement Sheet. 
// I'll implement a simple mobile menu with conditional rendering.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  if (!user) return null; // content protected by layout checks anyway

  const links = [
    { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard, roles: ["STUDENT"] },
    { href: "/dashboard/teacher", label: "Dashboard", icon: LayoutDashboard, roles: ["TEACHER"] },
    { href: "/dashboard/admin", label: "Přehled", icon: LayoutDashboard, roles: ["ADMIN"] },
    // Shared
    { href: "/tickets", label: "Všechny tickety", icon: Ticket, roles: ["STUDENT", "ADMIN"] }, 
    // Teacher sees only theirs on dashboard, but maybe a explicit list? keeping it simple per spec.
    // Admin specific
    { href: "/dashboard/admin/users", label: "Uživatelé", icon: Users, roles: ["ADMIN"] },
    { href: "/dashboard/admin/classrooms", label: "Třídy", icon: GraduationCap, roles: ["ADMIN"] },
    { href: "/dashboard/classrooms", label: "Třídy", icon: GraduationCap, roles: ["STUDENT"] },
    { href: "/dashboard/admin/audit", label: "Audit log", icon: FileText, roles: ["ADMIN"] },
    { href: "/dashboard/admin/attendance", label: "Docházka", icon: ClipboardCheck, roles: ["ADMIN"] },
    { href: "/dashboard/projectors", label: "Projektory", icon: Projector, roles: ["STUDENT", "ADMIN"] },
    { href: "/dashboard/planning", label: "Plánování", icon: Calendar, roles: ["STUDENT", "ADMIN"] },
    { href: "/dashboard/settings/notifications", label: "Notifikace", icon: Settings, roles: ["STUDENT", "TEACHER", "ADMIN"] },
  ];

  const filteredLinks = links.filter(l => l.roles.includes(user.role));

  const NavContent = () => (
      <nav className="space-y-2 p-4">
          <div className="mb-0 flex items-center justify-between px-2 py-4">
            <h1 className="text-xl font-bold tracking-tight">Helpdesk</h1>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <ModeToggle />
            </div>
          </div>
          <div className="space-y-1">
            {filteredLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                    <span className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === link.href ? "bg-accent/50 text-accent-foreground" : "text-muted-foreground"
                    )}>
                        <link.icon className="mr-2 h-4 w-4" />
                        {link.label}
                    </span>
                </Link>
            ))}
          </div>
      </nav>
  );

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 border-r bg-background md:block">
         <NavContent />
         <div className="absolute bottom-4 left-0 w-64 px-4">
             <div className="flex items-center gap-2 px-2 py-4">
                 <UserCircle className="h-5 w-5 opacity-70" />
                 <div className="text-xs">
                     <p className="font-medium">{user.fullName}</p>
                     <p className="text-muted-foreground">{user.email}</p>
                 </div>
             </div>
             <Button variant="outline" className="w-full justify-start mt-2" onClick={() => setChangePasswordOpen(true)}>
                 <KeyRound className="mr-2 h-4 w-4" /> Změnit heslo
             </Button>
             <Button variant="ghost" className="w-full justify-start mt-1 text-muted-foreground" onClick={logout}>
                 <LogOut className="mr-2 h-4 w-4" /> Odhlásit
             </Button>
         </div>
      </aside>
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />

      {/* Mobile Header */}
      <div className="flex h-14 items-center border-b px-4 md:hidden">
         <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             <Menu className="h-5 w-5" />
         </Button>
         <span className="ml-2 font-bold">Helpdesk</span>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden">
               <div className="flex justify-between border-b p-4 items-center">
                   <div className="flex items-center gap-2">
                       <span className="font-bold">Menu</span>
                       <NotificationBell />
                       <ModeToggle />
                   </div>
                   <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                       <Menu className="h-5 w-5" /> {/* Close icon ideally */}
                   </Button>
               </div>
               <NavContent />
               <div className="p-4">
                   <Button variant="outline" className="w-full" onClick={logout}>Odhlásit</Button>
               </div>
          </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
          {children}
      </main>
    </div>
  );
}
