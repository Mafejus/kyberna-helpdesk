"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TicketList } from "@/components/dashboard/TicketList";
import { PlusCircle } from "lucide-react";
import { DashboardScheduleSection } from "@/components/schedule/DashboardScheduleSection";

export default function TeacherDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tickets?limit=100')
        .then(res => {
            const data = res.data;
            if (Array.isArray(data)) {
                setTickets(data);
            } else if (data && Array.isArray(data.data)) {
                setTickets(data.data);
            } else {
                setTickets([]);
            }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Moje hlášení</h1>
            <p className="text-muted-foreground">Správa nahlášených závad</p>
        </div>
        <Link href="/dashboard/teacher/create">
            <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Nahlásit závadu
            </Button>
        </Link>
      </div>

      <TicketList 
          tickets={tickets} 
          role="TEACHER" 
          title="Seznam závad"
          description="Přehled všech vámi nahlášených ticketů."
      />

      <DashboardScheduleSection />
    </div>
  );
}
