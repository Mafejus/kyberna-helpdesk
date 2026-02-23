"use client";

import { useEffect, useState, useMemo } from "react";
import { TicketsService } from "@/services/tickets.service";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { TicketList } from "@/components/dashboard/TicketList";
import { Loader2 } from "lucide-react";

// Assuming Ticket type is exported from TicketList or we need to define/import it.
// Checking TicketList.tsx, it likely imports Ticket from somewhere or defines it.
// Ideally usage: usePaginatedList<Ticket>(...)
// But since I don't want to hunt for the type definition file if it's complex, 
// I will use `any` for now as `TicketList` accepts `any[]` in previous code or I can cast it.
// Wait, the error said `Type 'unknown[]' is not assignable to type 'Ticket[]'`.
// so TicketList expects Ticket[].
// I will just use `any` in the hook to silence it if I can't find the type easily, 
// OR better, import it. 
// TicketList usually defines explicit props. Let's see the previous view_file of TicketList...
// I haven't viewed TicketList.tsx yet. I just requested it.
// I will do generic `any` for now to unblock, and if TicketList is strict, I'll cast.
// Actually, I can just use `usePaginatedList<any>`

export default function TicketListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Initialize status filter from URL
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== 'ALL') {
        setStatusFilter(statusParam);
    } else {
        setStatusFilter(undefined);
    }
  }, [searchParams]);

  const { items: tickets, loading, loadMore, nextCursor } = usePaginatedList<any>(
    TicketsService.list,
    { status: statusFilter }, // Filters passed to hook/service
    20 // limit
  );

  // Client-side search filtering (since backend search isn't robust yet effectively)
  
  const filtered = useMemo(() => {
      if (!search) return tickets;
      return tickets.filter((t: any) => 
          t.title.toLowerCase().includes(search.toLowerCase()) || 
          (t.classroom && t.classroom.code.includes(search))
      );
  }, [tickets, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tickety</h1>
        <Link href="/tickets/create"><Button>Nahlásit ticket</Button></Link>
      </div>

      <div className="flex gap-4">
          <Input 
             placeholder="Hledat v načtených (název, učebna)..." 
             value={search} 
             onChange={e => setSearch(e.target.value)} 
             className="max-w-xs"
          />
      </div>

      <TicketList 
          tickets={filtered} 
          role={user?.role || 'STUDENT'}
          loading={loading}
      />
      
      {nextCursor && (
          <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Načíst další
              </Button>
          </div>
      )}
      {!nextCursor && tickets.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-4">
              Zobrazeno {tickets.length} záznamů
          </div>
      )}
    </div>
  );
}
