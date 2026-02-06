"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { NotificationService } from "@/services/notification.service";
import { usePathname } from "next/navigation";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchCount = async () => {
    try {
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCount();
    // Poll every 30s for new updates
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [pathname]); // Refresh when navigating, might have read something on the page

  return (
    <Link href="/dashboard/notifications">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        <span className="sr-only">Notifikace</span>
      </Button>
    </Link>
  );
}
