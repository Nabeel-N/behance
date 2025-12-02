"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HomeIcon from "./HomeIcon";
import PlusIcon from "./PlusIcon";
import ProfileIcon from "./ProfileIcon";
import Pinlogo from "./logo";
import Notificationbar from "./Notificationbar";

interface SidebarProps {
  openvariable: boolean;
  funOpenmodal: (openvariable: boolean) => void;
}

export default function Sidebar({ openvariable, funOpenmodal }: SidebarProps) {
  const router = useRouter();
  // 👇 State to toggle notifications
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-24 flex flex-col items-center py-6 bg-white border-r border-gray-100 z-50 gap-8">
        {/* Logo */}
        <div className="mb-2">
          <Pinlogo />
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col gap-6 w-full items-center">
          <HomeIcon />

          <PlusIcon onClick={() => funOpenmodal(!openvariable)} />

          {/* 👇 Notification Bell Icon */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`group p-3 rounded-xl transition-all duration-200 hover:bg-gray-100 ${
              showNotifications ? "bg-black text-white" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-7 h-7 transition-colors ${
                showNotifications ? "text-white" : "group-hover:text-black"
              }`}
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 18a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <ProfileIcon />
        </div>

        {/* Login Button */}
        <div className="mt-auto mb-4">
          <button
            onClick={() => router.push("/auth")}
            className="px-3 py-2 rounded-full font-bold text-xs bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Log in
          </button>
        </div>
      </aside>

      {/* 👇 Render the Notification Bar here */}
      {/* "left-24" pushes it to the right of the sidebar */}
      {showNotifications && (
        <div className="fixed left-24 top-0 h-screen z-40 flex items-start pt-4 pl-4">
          {/* Clicking outside closes it */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowNotifications(false)}
          />

          <div className="relative z-50">
            <Notificationbar />
          </div>
        </div>
      )}
    </>
  );
}
