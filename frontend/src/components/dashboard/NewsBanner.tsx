"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Ticket, Monitor } from "lucide-react";
import Link from "next/link";

export function NewsBanner() {
  const [weeklyTickets, setWeeklyTickets] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<{ count: number }>("/stats/weekly-tickets")
      .then((res) => setWeeklyTickets(res.data.count))
      .catch(() => {});
  }, []);

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Megaphone className="h-5 w-5 shrink-0" />
          <span className="font-semibold text-sm">Novinky</span>
        </div>

        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Monitor className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <span>
              Sekce{" "}
              <Link
                href="/dashboard/projectors"
                className="font-medium text-blue-700 dark:text-blue-400 underline underline-offset-2"
              >
                Vybavení
              </Link>{" "}
              nyní podporuje 5 kategorií (Projektory, Hub, Audio, AP, Ostatní) s vlastními sloupci a
              inline editací.
            </span>
          </li>
          {weeklyTickets !== null && (
            <li className="flex items-start gap-2">
              <Ticket className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <span>
                Tento týden bylo vytvořeno{" "}
                <span className="font-semibold">{weeklyTickets}</span>{" "}
                {weeklyTickets === 1
                  ? "nový ticket"
                  : weeklyTickets >= 2 && weeklyTickets <= 4
                    ? "nové tickety"
                    : "nových ticketů"}
                .
              </span>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
