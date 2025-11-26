"use client";

import { useRouter } from "next/navigation";

export default function PinModal() {
  const router = useRouter();
  return (
    <div className="fixed top-16 left-24 mt-48 bg-white w-60 rounded-2xl  border border-gray-300 shadow-lg p-4 flex flex-col z-50 animate-in slide-in-from-left-5 duration-200">
      <h1 className="font-bold text-xl text-black mb-3 px-1">Create</h1>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/pin-creation-tool")}
          className="text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm  transition-colors text-gray-700"
        >
          Create Pin
        </button>
        <button className="text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-sm transition-colors text-gray-700">
          Create Board
        </button>
      </div>
    </div>
  );
}
