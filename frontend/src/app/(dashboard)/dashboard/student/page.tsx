"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LeaderboardWidget } from "@/components/dashboard/LeaderboardWidget";
import { TicketList } from "@/components/dashboard/TicketList";
import { BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardScheduleSection } from "@/components/schedule/DashboardScheduleSection";
import Link from "next/link";




export default function StudentDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("my"); // 'my' | 'available'
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'STUDENT') {
        let url = '/tickets';
        if (activeTab === 'my') {
            url += '?filter=assigned';
        } else if (activeTab === 'available') {
            url += '?status=UNASSIGNED';
        }
        api.get(url).then(res => {
            const data = res.data;
            if (Array.isArray(data)) {
                setTickets(data);
            } else if (data && Array.isArray(data.items)) {
                setTickets(data.items);
            } else {
                setTickets([]);
            }
        });
        api.get('/stats/student/me').then(res => setStats(res.data));
    }
  }, [user, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Můj přehled</h1>
            <p className="text-muted-foreground">Vítej zpět, {user?.fullName}</p>
        </div>
        <Link href="/tickets/create">
            <Button>Nahlásit problém</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moje body</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPoints || 0} XP</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vyřešené tickety</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approvedCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
        {/* Main Content - Ticket List */}
        <div className="md:col-span-2 lg:col-span-5 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="my">Moje tickety</TabsTrigger>
                    <TabsTrigger value="available">Volné tickety</TabsTrigger>
                </TabsList>
                <TabsContent value="my" className="mt-4">
                    <TicketList 
                        tickets={tickets} 
                        role="STUDENT" 
                        title="Moje Tickety" 
                        description="Tickety, na kterých pracujete nebo jste je odevzdali."
                    />
                </TabsContent>
                <TabsContent value="available" className="mt-4">
                     <TicketList 
                        tickets={tickets} 
                        role="STUDENT" 
                        title="Volné Tickety" 
                        description="Tickety, které nikdo neřeší a můžete je převzít."
                    />
                </TabsContent>
            </Tabs>
        </div>

        {/* Sidebar - Leaderboard */}
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <LeaderboardWidget />
        </div>
      </div>

      <DashboardScheduleSection />
    </div>
  );
}
