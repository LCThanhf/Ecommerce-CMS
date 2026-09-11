import React from 'react';
import { ShoppingCart, Package, User, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AdminNotification } from '../../store/notification.slice';

interface NotificationItemProps {
  notification: AdminNotification;
  onRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'new_order':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'inventory_alert':
        return <Package className="h-5 w-5 text-orange-500" />;
      case 'new_customer':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: vi,
      })
    : '';

  return (
    <div
      className={`flex items-start gap-4 p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50/50' : 'bg-white'
      }`}
      onClick={() => {
        if (!notification.isRead) {
          onRead(notification.id);
        }
      }}
    >
      {/* Icon Area */}
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${
            !notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'
          }`}
        >
          {notification.message}
        </p>
        <p className="text-xs text-slate-500 mt-1">{timeAgo}</p>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0 flex items-center justify-center h-full pt-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
        </div>
      )}
    </div>
  );
};
