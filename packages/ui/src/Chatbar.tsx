"use client";

import { useState, useEffect, MouseEventHandler } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
}

export default function Chatbar() {
  const [searchModal, setSearchModal] = useState(false);
  const [profiledata, SetProfiledata] = useState<User[] | null>([]);
  const [name, Setname] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chatModal, SetChatModal] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (name.trim()) {
        profilesearchitem();
      } else {
        SetProfiledata([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [name]);

  async function profilesearchitem() {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users?search=${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("api/users fetching failed");
      }
      const data = await response.json();
      SetProfiledata(data);
    } catch (e) {
      console.error(e);
      SetProfiledata([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-[360px] bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col h-[85vh] overflow-hidden">
        {/* Header Section */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 flex flex-col gap-4 min-h-[80px] justify-center border-b border-gray-50">
          {searchModal ? (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <SearchBar autoFocus Setname={Setname} name={name} />
              <button
                onClick={() => {
                  setSearchModal(false);
                  Setname("");
                  SetProfiledata([]);
                }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Close search"
              >
                <CloseIcon />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Messages
              </h2>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-2 overflow-y-auto pb-4 flex-1">
          {/* Main Actions - Hidden during search */}
          {!searchModal && (
            <div className="flex flex-col gap-1 px-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button
                onClick={() => setSearchModal(true)}
                className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 rounded-2xl transition-all group text-left"
              >
                <div className="bg-red-50 p-3 rounded-full group-hover:bg-red-100 transition-colors text-red-600">
                  <NewMessageIcon />
                </div>
                <span className="font-semibold text-gray-800 text-sm">
                  New Message
                </span>
              </button>

              <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-50 rounded-2xl transition-all group text-left">
                <div className="bg-gray-100 p-3 rounded-full group-hover:bg-gray-200 transition-colors text-gray-700">
                  <AddFriendsIcon />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800 text-sm">
                    Invite Your Friends
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Connect to start chatting
                  </span>
                </div>
              </button>

              <div className="h-px bg-gray-100 my-2 mx-2"></div>
            </div>
          )}

          {/* Search Results or Empty State */}
          <div className="px-2">
            {searchModal ? (
              loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : profiledata && profiledata.length > 0 ? (
                <div className="flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Found Users
                  </p>
                  {profiledata.map((user) => (
                    <UserItem
                      key={user.id}
                      user={user}
                      onClick={() => SetChatModal(!chatModal)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center mt-10 opacity-40">
                  <p className="text-sm text-gray-400">
                    {name ? "No users found" : "Type a name to search..."}
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Recent
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function UserItem({
  user,
  onClick,
}: {
  user: User;
  onClick: MouseEventHandler;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-2xl transition-all group text-left"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user.name?.charAt(0).toUpperCase() || "?"
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-gray-800 text-sm truncate">
          {user.name}
        </span>
        <span className="text-xs text-gray-500 truncate">{user.email}</span>
      </div>
    </button>
  );
}

function ChatItem({
  name,
  message,
  time,
  unread,
}: {
  name: string;
  message: string;
  time: string;
  unread: number;
}) {
  return (
    <button className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-2xl transition-all group text-left">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="font-semibold text-gray-900 text-sm truncate">
            {name}
          </span>
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate group-hover:text-gray-700 transition-colors">
          {message}
        </p>
      </div>
      {unread > 0 && (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
          {unread}
        </div>
      )}
    </button>
  );
}

interface SearchBarProps {
  autoFocus: boolean;
  name: string;
  Setname: (v: string) => void;
}

function SearchBar({ autoFocus, name, Setname }: SearchBarProps) {
  return (
    <div className="relative group w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        onChange={(e) => Setname(e.target.value)}
        value={name}
        autoFocus={autoFocus}
        type="text"
        className="block w-full pl-9 pr-3 py-2.5 border border-transparent rounded-xl leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-200 transition-all duration-200 text-sm"
        placeholder="Search friends..."
      />
    </div>
  );
}

// --- Icons ---

function NewMessageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

function AddFriendsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-4 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
