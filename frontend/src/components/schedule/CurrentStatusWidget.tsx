"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScheduleService } from '@/services/schedule.service';
import { CurrentStatusResponse } from '@/types/schedule';
import { User } from 'lucide-react';

export function CurrentStatusWidget() {
  const [data, setData] = useState<CurrentStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await ScheduleService.getCurrentStatus();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch status", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full mt-6 border-l-4 border-l-blue-500">
        <CardContent className="p-6 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, next } = data || {};

  return (
    <Card className="w-full mt-6 border-l-4 border-l-indigo-500 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Aktuálně na helpdesku
        </CardTitle>
      </CardHeader>
      <CardContent>
        {current ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-indigo-700 animate-pulse">
                  {current.assignees.length > 0 ? current.assignees.map(a => a.fullName).join(", ") : "Nikdo (zapsaný)"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {current.time.start} – {current.time.end} ({current.lesson}. hodina)
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
              Právě probíhá
            </Badge>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-gray-700">Teď tu nikdo není.</p>
              {next ? (
                <p className="text-sm text-gray-500 mt-1">
                  Nejbližší služba: <span className="font-semibold text-indigo-600">{next.assignees.map(a => a.fullName).join(", ")}</span> 
                  {' '}({next.date === new Date().toISOString().split('T')[0] ? 'Dnes' : next.date}, {next.time.start})
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">Žádné další služby tento týden.</p>
              )}
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              Mimo provoz
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
