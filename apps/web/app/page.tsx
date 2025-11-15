"use client";

import { MouseEvent, useEffect, useState } from "react";

interface Project {
  id: string;
  image: string;
  title: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function Home() {
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);
  const [projectData, setProjectData] = useState<Project[]>([]);
  return <div className="h-screen w-full">
    hi
  </div>
}





