"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/store/slices/walletSlice"
import type { WalletNotification } from "@/store/slices/walletSlice"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function WalletNotifications() {
  const dispatch = useAppDispatch()
  const { notifications, hasUnreadNotifications } = useAppSelector((state) => state.wallet)
  const [isOpen, setIsOpen] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)

  // Check for unread notifications on component mount
  useEffect(() => {
    if (hasUnreadNotifications) {
      setShowNotificationPopup(true)

      // Auto-hide the popup after 5 seconds
      const timer = setTimeout(() => {
        setShowNotificationPopup(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [hasUnreadNotifications])

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && hasUnreadNotifications) {
      // Mark all as read when opening the dialog
      dispatch(markAllNotificationsAsRead())
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Updates about your wallet transactions and activity</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} onMarkAsRead={handleMarkAsRead} />
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification popup */}
      {showNotificationPopup && notifications.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50 max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 animate-in slide-in-from-right">
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-sm flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                New Notification
              </h4>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowNotificationPopup(false)}>
                &times;
              </Button>
            </div>
            <p className="text-sm mt-2">{notifications.find((n) => n.status === "unread")?.message}</p>
            <div className="mt-2 flex justify-end">
              <Button variant="link" size="sm" className="h-6 p-0 text-xs" onClick={() => setIsOpen(true)}>
                View all
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: WalletNotification
  onMarkAsRead: (id: string) => void
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        notification.status === "unread" ? "bg-primary/5 border-primary/20" : "bg-background border-muted"
      }`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`w-2 h-2 rounded-full mt-1.5 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        />
        <div className="flex-1 mx-2">
          <p className="text-sm">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {notification.status === "unread" && (
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => onMarkAsRead(notification.id)}>
            Mark as read
          </Button>
        )}
      </div>
    </div>
  )
}
