"use client";

import { MouseEvent, useEffect, useState } from "react";

interface Project {
  image: string,
  title: string;
  userId: string;
}
export default function Home() {
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [Projectdata, SetProjectdata] = useState<Project[]>([]);

  function toggleCardVisibility() {
    setIsCardVisible(prev => !prev);
  }

  return (
    <div className="h-screen w-full ">
      <div className="mt-12 ">
        <div className=" flex items-center justify-center gap-4">
          <SearchClick />
          <PlusIons onIconClick={toggleCardVisibility} />
        </div>

        {isCardVisible && (
          <div className="flex items-center justify-center ">
            <Card />
          </div>
        )}
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="w-3/4 bg-blue-500 mr-16 pb-36   rounded-3xl text-white ">
      <div className=" mt-36   flex items-center justify-center ">
        <Button />
      </div>
    </div>
  );
}


function Button() {
  return <button className="bg-emerald-400 border-2  rounded-3xl p-2" >Choose Image</button>
}

function SearchClick() {
  return (
    <div className=" w-3/4  bg-neutral-100 p-1 rounded-full border-zinc-300 border-2">
      <span className="flex items-center justify-start gap-1 ml-2 font-bold text-md text-neutral-400">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search behance"
          className="w-full bg-transparent outline-none text-black p-2"
        />
      </span>
    </div>
  );
}

function SearchIcon() {
  return (
    <span className="p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </span>
  );
}

function PlusIons({ onIconClick }: { onIconClick: () => void }) {
  return (
    <span className="bg-blue-500 rounded-lg cursor-pointer" onClick={onIconClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-12"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </span>
  );
}
