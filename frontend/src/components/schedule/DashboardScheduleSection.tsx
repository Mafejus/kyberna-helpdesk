"use client";

import { useState, useEffect } from "react";
import { WeeklyCalendar } from "@/components/schedule/WeeklyCalendar";
import { CurrentStatusWidget } from "@/components/schedule/CurrentStatusWidget";
import { ScheduleService } from "@/services/schedule.service";
import { WeekSchedule } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ServiceHistory } from "@/components/dashboard/ServiceHistory";

export function DashboardScheduleSection() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Always start with current week
  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const m = new Date(d);
    m.setDate(diff);
    return m;
  };
  const [mondayDate, setMondayDate] = useState(getMonday(new Date()));

  const loadData = async () => {
    setLoading(true);
    try {
      const startStr = mondayDate.toISOString().split('T')[0];
      const data = await ScheduleService.getWeek(startStr);
      setWeekData(data);
    } catch (error) {
      console.error("Failed to load schedule", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mondayDate]);

  const handleNavigate = (dir: 'prev' | 'next' | 'today') => {
    const newDate = new Date(mondayDate);
    if (dir === 'today') {
      setMondayDate(getMonday(new Date()));
    } else {
      newDate.setDate(newDate.getDate() + (dir === 'next' ? 7 : -7));
      setMondayDate(newDate);
    }
  };

  return (
    <div className="space-y-6 mt-10 border-t pt-36">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Rozpis helpdesku</h2>
        {user?.role !== 'TEACHER' && (
          <Link href="/dashboard/planning">
            <Button variant="outline" size="sm">
              Spravovat služby <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Widget + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
           <CurrentStatusWidget />
           {user?.role === 'STUDENT' && <ServiceHistory />}
        </div>
        <div className="lg:col-span-3">
           <WeeklyCalendar 
             startDate={mondayDate}
             weekData={weekData}
             loading={loading}
             onNavigate={handleNavigate}
             onSlotClick={() => {}} // No-op, read only on dashboard
           />
        </div>
      </div>
    </div>
  );
}
