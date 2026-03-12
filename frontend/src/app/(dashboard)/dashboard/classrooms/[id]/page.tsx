"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TicketList } from "@/components/dashboard/TicketList";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PcList } from "@/components/classrooms/PcList";
import { SocketList } from "@/components/classrooms/SocketList";

export default function ClassroomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [classroom, setClassroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch tickets (all visible) -> Filter by classroom
    // 2. Fetch classroom details (code) -> We need endpoint or just rely on tickets.
    // Let's assume we filter tickets.
    // If we want classroom name, we might need GET /classrooms/:id.
    // I'll try to find classroom code from the first ticket or generic fetch.
    
    // Actually, backend structure:
    // GET /tickets returns tickets with classroom relation.
    
    const fetchData = async () => {
        try {
            const res = await api.get('/tickets');
            let allTickets = [];
            if (Array.isArray(res.data)) {
                allTickets = res.data;
            } else if (res.data && Array.isArray(res.data.items)) {
                allTickets = res.data.items;
            }
            
            const classTickets = allTickets.filter((t: any) => t.classroomId === id || t.classroom?.id === id);
            setTickets(classTickets);
            
            // Try to set classroom info from first ticket
            if (classTickets.length > 0) {
                setClassroom(classTickets[0].classroom);
            } else {
                // If no tickets, we don't know the code. Ideally we fetch classroom.
                // Assuming /classrooms/:id exists or we just show ID.
                // Let's check `ClassroomsController`.
                try {
                     const clsRes = await api.get(`/classrooms/${id}`);
                     setClassroom(clsRes.data);
                } catch (e) {
                    // ignore if failing
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id]);

  const role = user?.role === 'ADMIN' ? 'ADMIN' : (user?.role === 'TEACHER' ? 'TEACHER' : 'STUDENT');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4"/> Zpět
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">
                Třída {classroom?.code || 'Detail'}
            </h1>
            <p className="text-muted-foreground">Přehled ticketů v této učebně</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList>
            <TabsTrigger value="tickets">Tickety</TabsTrigger>
            <TabsTrigger value="pcs">PC</TabsTrigger>
            <TabsTrigger value="sockets">Zásuvky</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
            <TicketList 
                tickets={tickets} 
                role={role as any} 
                title={`Tickety: ${classroom?.code || id}`}
                description={`Celkem ${tickets.length} záznamů.`}
            />
        </TabsContent>
        <TabsContent value="pcs">
            <PcList classroomId={id as string} role={role as any} />
        </TabsContent>
        <TabsContent value="sockets">
            <SocketList classroomId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
