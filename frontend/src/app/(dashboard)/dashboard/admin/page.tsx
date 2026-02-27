"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import { PendingTicketsWidget } from "@/components/dashboard/PendingTicketsWidget";
import { OverdueTicketsWidget } from "@/components/dashboard/OverdueTicketsWidget";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen } from "lucide-react";
import { DashboardScheduleSection } from "@/components/schedule/DashboardScheduleSection";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/stats/admin/overview').then(res => setStats(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
            <Link href="/tickets/create"><Button size="sm">Nový ticket</Button></Link>
            <Link href="/dashboard/admin/users"><Button variant="outline" size="sm"><Users className="mr-2 h-4 w-4"/> Uživatelé</Button></Link>
            <Link href="/dashboard/admin/classrooms"><Button variant="outline" size="sm"><BookOpen className="mr-2 h-4 w-4"/> Třídy</Button></Link>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Celkem ticketů</CardTitle></CardHeader>
            <CardContent className="pb-4"><div className="text-xl font-bold">{stats?.totalTickets}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
            <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs font-medium text-warning uppercase tracking-wider">Čeká na schválení</CardTitle></CardHeader>
            <CardContent className="pb-4"><div className="text-xl font-bold">{stats?.waiting}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
            <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs font-medium text-success uppercase tracking-wider">Vyřešeno</CardTitle></CardHeader>
            <CardContent className="pb-4"><div className="text-xl font-bold">{stats?.approved}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
            <CardHeader className="pb-1 pt-4"><CardTitle className="text-xs font-medium text-destructive uppercase tracking-wider">Neschváleno</CardTitle></CardHeader>
            <CardContent className="pb-4"><div className="text-xl font-bold">{stats?.rejected}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
        {/* Main Content - Pending Tickets */}
        <div className="md:col-span-2 lg:col-span-5">
            <PendingTicketsWidget />
        </div>

        {/* Sidebar - Leaderboard & Overdue */}
        <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-6">
            <OverdueTicketsWidget />
            <LeaderboardWidget />
        </div>
      </div>

      <div className="mt-8">
        <DashboardScheduleSection />
      </div>
    </div>
  );
}
