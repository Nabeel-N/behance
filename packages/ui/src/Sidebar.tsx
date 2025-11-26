"use client";
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
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-4 bg-white shadow-xl gap-8">
      <Pinlogo />
      <MenuIcon />
      <HomeIcon />
      <ProfileIcon />
      <PlusIcon onClick={() => funOpenmodal(!openvariable)} />
    </aside>
  );
}
