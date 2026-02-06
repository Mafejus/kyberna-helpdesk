"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import api from "@/lib/api";

type LeaderboardEntry = {
  userId: string;
  fullName: string;
  points: number;
  approvedCount: number;
};

export function LeaderboardWidget() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/leaderboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-muted-foreground text-sm">Načítám žebříček...</div>;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Trophy className="h-5 w-5 text-warning" />
           Žebříček studentů
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
           <div className="text-sm text-muted-foreground">Zatím žádné body.</div>
        ) : (
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {data.slice(0, 10).map((student, index) => (
              <div key={student.userId} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs ${index === 0 ? 'bg-warning text-warning-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{student.fullName}</p>
                    <p className="text-xs text-muted-foreground">{student.approvedCount} vyřešených ticketů</p>
                  </div>
                </div>
                <Badge variant="outline" className={`ml-auto font-mono ${student.points < 0 ? 'text-destructive border-destructive/50' : 'text-primary'}`}>
                    {student.points} XP
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
