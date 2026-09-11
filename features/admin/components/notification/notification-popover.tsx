'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import bellIcon from '@/app/assets/bell.svg';
import { RootState } from '@/store/store';
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead,
} from '../../store/notification.slice';
import { NotificationItem } from './notification-item';
import { Button } from '@/components/ui/button';

export const NotificationPopover: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [open, setOpen] = useState(false);

  const { items, isLoading, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    // Fetch notifications initially
    dispatch(fetchNotifications());
    
    // We could set up a polling interval here or WebSocket connection in the future
    // const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    // return () => clearInterval(interval);
  }, [dispatch]);

  const handleRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleReadAll = () => {
    dispatch(markAllAsRead());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-700 transition p-1.5 rounded-full hover:bg-slate-100/60 cursor-pointer"
          aria-label="Thông báo"
        >
          <Image
            src={bellIcon}
            alt="Thông báo"
            className="h-[22px] w-[22px] object-contain"
          />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-900">Thông báo</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleReadAll}
            >
              <Check className="h-4 w-4 mr-1" />
              Đánh dấu đã đọc
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : items.length > 0 ? (
            <div className="flex flex-col">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleRead}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Image
                src={bellIcon}
                alt="Không có thông báo"
                className="h-8 w-8 mb-2 opacity-50 grayscale"
              />
              <p className="text-sm">Không có thông báo nào</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
