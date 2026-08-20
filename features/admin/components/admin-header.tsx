"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import avatarImg from "@/app/assets/avatar.png";
import bellIcon from "@/app/assets/bell.svg";
import { AdminImageZoomModal } from "./ui/admin-image-zoom-modal";
import type { RootState } from "@/store/store";
import { api } from "@/services/api";

interface AdminHeaderProps {
  title?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
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
        }).catch(console.error);
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
        {/* Notification Bell with SVG Icon */}
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
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            4
          </span>
        </button>

        {/* User Avatar - Clickable to zoom */}
        <div
          onClick={() => setIsZoomOpen(true)}
          className="relative cursor-pointer group"
          title="Nhấp để phóng to avatar"
        >
          <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-xs relative">
            <img
              src={avatarToDisplay}
              alt="Admin Avatar"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-[1px] h-3 w-3 rounded-full bg-[#28C76F] border-[2px] border-white shadow-2xs z-10" />
        </div>
      </div>

      {/* Avatar Zoom Modal */}
      <AdminImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        src={avatarToDisplay}
        title="Admin Avatar"
      />
    </header>
  );
};

