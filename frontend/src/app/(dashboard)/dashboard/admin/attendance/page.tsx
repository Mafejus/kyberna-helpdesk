"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AttendanceService, AttendanceSummary, CurrentAttendanceStatus } from "@/services/attendance.service";
import { AttendanceStatsCards } from "@/components/attendance/AttendanceStatsCards";
import { AttendanceSummaryTable } from "@/components/attendance/AttendanceSummaryTable";
import { StudentAttendanceDetailDialog } from "@/components/attendance/StudentAttendanceDetailDialog";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search } from "lucide-react";
import { subDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAttendancePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{from: string, to: string}>({
      from: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      to: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  });
  const [rangePreset, setRangePreset] = useState("thisWeek");
  
  const [summaryData, setSummaryData] = useState<AttendanceSummary[]>([]);
  const [currentStatus, setCurrentStatus] = useState<CurrentAttendanceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);

  // RBAC Redirect
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Load Data
  const loadData = async () => {
    if (!user || user.role !== "ADMIN") return;
    setLoading(true);
    try {
      const [summary, current] = await Promise.all([
        AttendanceService.getSummary(dateRange.from, dateRange.to),
        AttendanceService.getCurrentStatus()
      ]);
      setSummaryData(summary);
      setCurrentStatus(current);
    } catch (e) {
      console.error("Failed to load attendance data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange, user]); // Reload when range changes

  // Filter handlers
  const handlePresetChange = (val: string) => {
      setRangePreset(val);
      const today = new Date();
      if (val === 'thisWeek') {
          setDateRange({
              from: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
              to: format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          });
      } else if (val === 'lastWeek') {
          const lastWeek = subWeeks(today, 1);
          setDateRange({
              from: format(startOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
              to: format(endOfWeek(lastWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')
          });
      } else if (val === 'thisMonth') {
          setDateRange({
              from: format(startOfMonth(today), 'yyyy-MM-dd'),
              to: format(endOfMonth(today), 'yyyy-MM-dd')
          });
      }
      // 'custom' does nothing, user sets inputs
  };

  // Derived metrics
  const totalWorked = summaryData.reduce((acc, s) => acc + s.workedShifts, 0);
  const totalShifts = summaryData.reduce((acc, s) => acc + s.totalShifts, 0);
  const totalLate = summaryData.reduce((acc, s) => acc + s.stats.late, 0);
  const totalNoShow = summaryData.reduce((acc, s) => acc + s.stats.noShow, 0);
  const totalMissingCheckout = summaryData.reduce((acc, s) => acc + s.stats.missingCheckout, 0);

  // Filtering list
  const filteredStudents = summaryData.filter(s => 
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || !user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Docházka</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => AttendanceService.downloadExport(dateRange.from, dateRange.to)}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
        </div>
      </div>

      <AttendanceStatsCards 
         totalShifts={totalShifts}
         workedShifts={totalWorked}
         lateShifts={totalLate}
         noShowShifts={totalNoShow}
         missingCheckoutShifts={totalMissingCheckout}
         currentStatus={currentStatus}
      />

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Přehled studentů</TabsTrigger>
          <TabsTrigger value="calendar">Kalendář směn</TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between bg-card p-4 rounded-lg border shadow-sm">
             <div className="flex flex-col gap-2 md:flex-row md:items-end">
                 <div className="w-full sm:w-[180px]">
                     <label className="text-xs font-medium mb-1 block">Rychlý filtr</label>
                     <Select value={rangePreset} onValueChange={handlePresetChange}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                             <SelectItem value="thisWeek">Tento týden</SelectItem>
                             <SelectItem value="lastWeek">Minulý týden</SelectItem>
                             <SelectItem value="thisMonth">Tento měsíc</SelectItem>
                             <SelectItem value="custom">Vlastní rozsah</SelectItem>
                         </SelectContent>
                     </Select>
                 </div>
                 
                 <div>
                     <label className="text-xs font-medium mb-1 block">Od</label>
                     <Input 
                        type="date" 
                        value={dateRange.from} 
                        onChange={(e) => { setDateRange(prev => ({ ...prev, from: e.target.value })); setRangePreset('custom'); }} 
                        className="w-full sm:w-[150px]"
                     />
                 </div>
                 <div>
                     <label className="text-xs font-medium mb-1 block">Do</label>
                     <Input 
                        type="date" 
                        value={dateRange.to} 
                        onChange={(e) => { setDateRange(prev => ({ ...prev, to: e.target.value })); setRangePreset('custom'); }} 
                        className="w-full sm:w-[150px]"
                     />
                 </div>
             </div>
             
             {activeTab === 'overview' && (
                 <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Hledat studenta..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8" />
                 </div>
             )}
        </div>

        <TabsContent value="overview" className="space-y-4">
          <AttendanceSummaryTable data={filteredStudents} onViewDetail={setDetailStudentId} />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
           {/* Calendar Component handles its own week fetching but we might want to sync? 
               The instruction says "GET /attendance/calendar/week?start=YYYY-MM-DD".
               Our global filter is Range. Calendar View is usually Week based.
               Let's let Calendar handle its week navigation internally for simplicity, 
               or pass the "from" date as start week if it makes sense.
               The user asked for "Date range picker (from/to) pro přehled".
               "Tab switcher: Přehled | Kalendář".
               "Kalendář: týdenní grid".
               So Calendar likely has its own controls or uses the global one?
               Usually Calendar has "Prev/Next Week".
               I implemented internal state in AttendanceCalendar. I will keep it independent strictly speaking,
               but maybe initialize it with `dateRange.from`?
           */}
           <AttendanceCalendar />
        </TabsContent>
      </Tabs>

      <StudentAttendanceDetailDialog 
        studentId={detailStudentId} 
        onClose={() => setDetailStudentId(null)}
        dateRange={dateRange}
        studentName={summaryData.find(s => s.id === detailStudentId)?.fullName}
      />
    </div>
  );
}
