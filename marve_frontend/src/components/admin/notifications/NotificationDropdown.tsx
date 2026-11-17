"use client";

import {
  Bell,
  CheckCircle2,
  Info,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect } from "react";

export type NotificationItem = {
  id: number | string;
  title: string;
  message: string;
  time: string;
  type:
    | "ORDER"
    | "PAYMENT"
    | "SHIPPING"
    | "SYSTEM";
  unread?: boolean;
};

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications?: NotificationItem[];
  onClose: () => void;
  onMarkAllRead?: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "New Order Received",
    message:
      "A new order #ORD-1024 has been placed.",
    time: "5 min ago",
    type: "ORDER",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Successful",
    message:
      "Payment of ₹2,499 has been received successfully.",
    time: "18 min ago",
    type: "PAYMENT",
    unread: true,
  },
  {
    id: 3,
    title: "Order Shipped",
    message:
      "Order #ORD-1021 has been shipped.",
    time: "1 hour ago",
    type: "SHIPPING",
    unread: true,
  },
  {
    id: 4,
    title: "System Update",
    message:
      "Your store data has been synchronized successfully.",
    time: "3 hours ago",
    type: "SYSTEM",
    unread: false,
  },
];

function getNotificationIcon(
  type: NotificationItem["type"],
) {
  switch (type) {
    case "ORDER":
      return ShoppingBag;

    case "PAYMENT":
      return CheckCircle2;

    case "SHIPPING":
      return Package;

    case "SYSTEM":
    default:
      return Info;
  }
}

function getNotificationIconStyles(
  type: NotificationItem["type"],
) {
  switch (type) {
    case "ORDER":
      return "bg-[#6B3E1E]/8 text-[#6B3E1E]";

    case "PAYMENT":
      return "bg-emerald-50 text-emerald-700";

    case "SHIPPING":
      return "bg-blue-50 text-blue-700";

    case "SYSTEM":
    default:
      return "bg-[#F8F5F0] text-[#8A7D72]";
  }
}

export default function NotificationDropdown({
  isOpen,
  notifications = DEFAULT_NOTIFICATIONS,
  onClose,
  onMarkAllRead,
}: NotificationDropdownProps) {
  /*
   * Close drawer with Escape key.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, onClose]);

  /*
   * Prevent background page from scrolling
   * while notification drawer is open.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.unread,
    ).length;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
        />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="absolute right-0 top-0 flex h-dvh w-[calc(100vw-1rem)] max-w-[420px] flex-col overflow-hidden border-l border-[#6B3E1E]/10 bg-white shadow-[-12px_0_40px_rgba(41,35,31,0.16)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#6B3E1E]/8 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
              <Bell
                size={16}
                strokeWidth={1.7}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#29231F]">
                Notifications
              </h3>

              <p className="mt-0.5 text-[10px] text-[#A0958C]">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1
                        ? "s"
                        : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#A0958C] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
          >
            <X
              size={17}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 &&
          onMarkAllRead && (
            <div className="flex shrink-0 justify-end border-b border-[#6B3E1E]/6 px-4 py-2.5 sm:px-5">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[10px] font-semibold text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
              >
                Mark all as read
              </button>
            </div>
          )}

        {/* Notification List */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            <div className="flex min-h-full items-center justify-center px-5 py-10 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F5F0] text-[#8A7D72]">
                  <Bell
                    size={20}
                    strokeWidth={1.6}
                  />
                </div>

                <p className="mt-3 text-xs font-semibold text-[#665B53]">
                  No notifications
                </p>

                <p className="mt-1 text-[10px] text-[#A0958C]">
                  New notifications will appear here.
                </p>
              </div>
            </div>
          ) : (
            notifications.map(
              (notification) => {
                const Icon =
                  getNotificationIcon(
                    notification.type,
                  );

                const iconStyles =
                  getNotificationIconStyles(
                    notification.type,
                  );

                return (
                  <div
                    key={notification.id}
                    className={`flex gap-3 border-b border-[#6B3E1E]/6 px-4 py-4 transition-colors last:border-b-0 hover:bg-[#F8F5F0]/60 sm:px-5 ${
                      notification.unread
                        ? "bg-[#6B3E1E]/[0.025]"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconStyles}`}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-1.5">
                          {notification.unread && (
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C98A50]" />
                          )}

                          <p
                            className={`text-xs leading-4 ${
                              notification.unread
                                ? "font-semibold text-[#29231F]"
                                : "font-medium text-[#665B53]"
                            }`}
                          >
                            {
                              notification.title
                            }
                          </p>
                        </div>

                        <span className="shrink-0 whitespace-nowrap text-[9px] text-[#A0958C]">
                          {
                            notification.time
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-[#8A7D72]">
                        {
                          notification.message
                        }
                      </p>
                    </div>
                  </div>
                );
              },
            )
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#6B3E1E]/8 bg-[#F8F5F0]/40 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg py-2.5 text-[10px] font-semibold text-[#6B3E1E] transition-colors hover:bg-white hover:text-[#A66A32]"
          >
            Close Notifications
          </button>
        </div>
      </aside>
    </div>
  );
}