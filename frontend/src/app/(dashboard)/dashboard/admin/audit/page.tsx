"use client";

import { useEffect, useState } from "react";
import { AuditService } from "@/services/audit.service";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditPage() {
  // Filters
  const [entityType, setEntityType] = useState<string>("ALL");
  const [entityId, setEntityId] = useState("");
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");

  // Prepare filters object for the hook
  const filters = {
      entityType: entityType !== 'ALL' ? entityType : undefined,
      entityId: entityId.trim() || undefined,
      userId: userId.trim() || undefined,
      search: search.trim() || undefined
  };

  // Debounce could be useful here but for now relying on user clicking "Search" 
  // Wait, current design has "Search" button. 
  // If I use the hook, it reacts to `filters` change immediately. 
  // If I want "Search" button behavior, I should maintain a separate "activeFilters" state 
  // that only updates when button is clicked.

  const [activeFilters, setActiveFilters] = useState(filters);

  const handleSearch = () => {
    setActiveFilters({
        entityType: entityType !== 'ALL' ? entityType : undefined,
        entityId: entityId.trim() || undefined,
        userId: userId.trim() || undefined,
        search: search.trim() || undefined
    });
  };

  const { items: logs, loading, loadMore, nextCursor } = usePaginatedList(
    AuditService.getLogs,
    activeFilters,
    20 // default limit
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">Přehled systémových událostí a historie změn.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
             <Filter className="h-4 w-4"/> Filtry
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="space-y-2">
             <span className="text-sm font-medium">Typ entity</span>
             <Select value={entityType} onValueChange={setEntityType}>
               <SelectTrigger>
                 <SelectValue placeholder="Vše" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">Vše</SelectItem>
                 <SelectItem value="TICKET">Ticket</SelectItem>
                 <SelectItem value="SCHEDULE_SLOT">Slot (Rozvrh)</SelectItem>
                 <SelectItem value="USER">Uživatel</SelectItem>
                 <SelectItem value="SWAP">Výměna</SelectItem>
               </SelectContent>
             </Select>
          </div>
          <div className="space-y-2">
             <span className="text-sm font-medium">ID Entity / Ticketu</span>
             <Input placeholder="UUID..." value={entityId} onChange={e => setEntityId(e.target.value)} />
          </div>
          <div className="space-y-2">
             <span className="text-sm font-medium">ID Uživatele</span>
             <Input placeholder="UUID..." value={userId} onChange={e => setUserId(e.target.value)} />
          </div>
          <div className="space-y-2">
             <span className="text-sm font-medium">Hledat (Text / Aktér)</span>
             <Input placeholder="např. socket c 27..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
             {loading && !nextCursor ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Search className="h-4 w-4 mr-2"/>}
             Vyhledat
          </Button>
        </CardContent>
      </Card>

      <div className="border rounded-md bg-card overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead>Čas</TableHead>
              <TableHead>Akce</TableHead>
              <TableHead>Aktér</TableHead>
              <TableHead>Entita</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && !loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Žádné záznamy.
                    </TableCell>
                </TableRow>
            ) : (
                logs.map((log: any) => (
                    <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{log.actorName}</span>
                                <span className="text-xs text-muted-foreground">{log.actorRole}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col text-xs">
                                <span className="font-semibold">{log.entityType}</span>
                                <span className="text-muted-foreground font-mono truncate max-w-[100px]" title={log.entityId}>{log.entityId}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                             <div className="text-sm break-words whitespace-normal min-w-[200px]">
                                {log.message || "-"}
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {nextCursor && (
          <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Načíst další
              </Button>
          </div>
      )}
      {!nextCursor && logs.length > 0 && (
          <div className="text-center text-sm text-muted-foreground pt-2">
              Zobrazeno {logs.length} záznamů
          </div>
      )}
    </div>
  );
}
