import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

export default function ProfileIcon() {
  const router = useRouter();
  return (
    <button
      className="border-4 bg-gray-200 p-2 border-gray-300 rounded-full hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 "
      onClick={() => router.push("/profile")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-10  bottom-3 border-cyan-400 rounded-2xl"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </button>
  );
}
