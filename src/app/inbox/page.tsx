"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/Sidebar";
import { InboxZero } from "@/components/common/InboxZero";
import { CommandPalette } from "@/components/common/CommandPalette";
import { CreateIssueModal } from "@/components/common/CreateIssueModal";
import { api } from "@/lib/api";
import { Notification } from "@/types/notification";
import { formatDate } from "@/lib/utils";
import { Bell, Loader2, CheckCheck } from "lucide-react";

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res?.data || res || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all", {});
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-[#08090a] text-[#f7f8f8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-8 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#8a8f98]" />
            <h1 className="text-[15px] font-semibold text-white tracking-wide">Inbox</h1>
            <span className="text-[11px] font-mono text-[#8a8f98] bg-white/[0.05] px-2 py-0.5 rounded-full">
              {notifications.filter((n) => !n.isRead).length} unread
            </span>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[12px] text-[#8a8f98] hover:text-white px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          )}
        </div>

        <main className="flex-1 p-8">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-[#8a8f98]">
              <Loader2 className="w-6 h-6 animate-spin text-[#5e6ad2]" />
              <span className="text-[13px]">Loading inbox...</span>
            </div>
          ) : notifications.length === 0 ? (
            <InboxZero />
          ) : (
            <div className="max-w-3xl space-y-2">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                    !n.isRead
                      ? "bg-[#12141a] border-white/[0.12]"
                      : "bg-[#0d0e12]/50 border-white/[0.04] opacity-80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-[#5e6ad2]" />
                    <div>
                      <p className="text-[13px] font-medium text-white mb-1">{n.message}</p>
                      <span className="text-[11px] font-mono text-[#62666d]">
                        {formatDate(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateIssueModal onCreated={fetchNotifications} />
      <CommandPalette />
    </div>
  );
}
