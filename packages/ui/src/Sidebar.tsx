"use client";
import { useRouter } from "next/navigation";
import HomeIcon from "./HomeIcon";
import MenuIcon from "./MenuIcon";
import PlusIcon from "./PlusIcon";
import ProfileIcon from "./ProfileIcon";
import Pinlogo from "./logo";

interface SidebarProps {
  openvariable: boolean;
  funOpenmodal: (openvariable: boolean) => void;
}

export default function Sidebar({ openvariable, funOpenmodal }: SidebarProps) {
  const router = useRouter();
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-4 bg-gradient-to-l from-red-500  to-cyan-400 shadow-xl gap-8">
      <Pinlogo />
      <HomeIcon />
      <ProfileIcon />
      <PlusIcon onClick={() => funOpenmodal(!openvariable)} />
      <button
        onClick={() => router.push("/auth")}
        className="p-2 mt-64 rounded-lg shadow-2xl border-2 border-gray-700 font-semibold text-lg  bg-blue-700 hover:bg-blue-600 transition-all"
      >
        Log in
      </button>
    </aside>
  );
}
