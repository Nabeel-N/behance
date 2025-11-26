"use client";
import Sidebar from "@repo/ui/Sidebar";
import { useState } from "react";
import PinModal from "@repo/ui/PinModal";

export default function App() {
  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  return (
    <div>
      <Sidebar openvariable={plusiconModal} funOpenmodal={SetPlusIonModal} />
      <div className="ml-28 mr-56  mt-80">{plusiconModal && <PinModal />}</div>
    </div>

  );
}
