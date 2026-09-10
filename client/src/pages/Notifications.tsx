import React from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { NotificationItem } from "@/components/social/NotificationItem";
import { Notification, User, Post } from "@shared/schema";
import { Bell, Loader2 } from "lucide-react";

export default function Notifications() {
  const { data: notifications = [], isLoading } = useQuery<(Notification & { sender: User; post?: Post })[]>({
    queryKey: ["/api/notifications"],
  });

  return (
    <SocialLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-2">
          NOTIFICATION <span className="text-primary">ALERTS</span>
        </h1>
        <span className="text-xs font-display text-gray-400 uppercase">{notifications.length} alerts</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-1">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center my-6">
          <Bell className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-display font-bold text-white uppercase mb-1">You're all caught up</h3>
          <p className="text-gray-400 font-sans text-sm">No new notifications at this time.</p>
        </div>
      )}
    </SocialLayout>
  );
}
