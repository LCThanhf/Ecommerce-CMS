"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatarImg from "@/app/assets/avatar.png";
import bellIcon from "@/app/assets/bell.svg";
import type { RootState } from "@/store/store";
import { api } from "@/services/api";
import { NotificationPopover } from "./notification/notification-popover";

interface AdminHeaderProps {
  title?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem("admin_session");
    if (sessionStr) {
      try {
        const email = JSON.parse(sessionStr).email;
        setAdminEmail(email);
        // Fetch accounts to find this admin's avatar across all pages
        api.get<any[]>("/accounts").then((accounts) => {
          const admin = accounts.find((a) => a.email === email);
          if (admin?.avatar) {
            setLocalAvatar(admin.avatar);
          }
        }).catch(e => {
          if (e !== 'Unauthorized') console.error(e);
        });
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const adminUser = useSelector((state: RootState) => 
    state.adminUsers.items.find(u => u.email === adminEmail)
  );
  
  const avatarToDisplay = adminUser?.avatar || localAvatar || avatarImg.src;

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-transparent">
      {/* Page Title on the Left */}
      <div>
        {typeof title === "string" ? (
          <h1 className="text-[22px] font-bold text-[#1E293B] tracking-tight">
            {title}
          </h1>
        ) : (
          title
        )}
      </div>

      {/* Right controls: Bell & Avatar */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <NotificationPopover />

        {/* User Avatar */}
        <div className="relative">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-xs relative">
            <img
              src={avatarToDisplay}
              alt="Admin Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-[1px] h-3 w-3 rounded-full bg-[#28C76F] border-[2px] border-white shadow-2xs z-10" />
        </div>
      </div>
    </header>
  );
};

