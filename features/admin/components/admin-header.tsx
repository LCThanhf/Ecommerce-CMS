"use client";

import React from "react";
import Image from "next/image";
import avatarImg from "@/app/assets/avatar.png";
import bellIcon from "@/app/assets/bell.svg";

interface AdminHeaderProps {
  title?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title }) => {
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

        {/* User Avatar */}
        <div className="relative cursor-pointer">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-xs">
            <Image
              src={avatarImg}
              alt="Admin Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-[1px] h-3 w-3 rounded-full bg-[#28C76F] border-[2px] border-white shadow-2xs" />
        </div>
      </div>
    </header>
  );
};
