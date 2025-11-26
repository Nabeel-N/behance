"use client";
import Sidebar from "@repo/ui/Sidebar";
import PinModal from "@repo/ui/PinModal";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  title: string;
  image: string;
  user: {
    id: number;
    name: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function App() {
  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:4000/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  


  return (
    <div className="min-h-screen bg-black">
      {/* 1. Sidebar */}
      <Sidebar openvariable={plusiconModal} funOpenmodal={SetPlusIonModal} />
      {plusiconModal && <PinModal />}

      <main className="ml-24 p-6">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1600px]">
          {projects.map((project) => (
            <div
              key={project.id}
              className="break-inside-avoid relative group cursor-zoom-in"
            >
              {/* Image Card */}
              <div className="rounded-2xl overflow-hidden mb-2">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover hover:brightness-90 transition-all duration-300"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/300?text=No+Image")
                  }
                />
              </div>

              {/* Hover Overlay Button (Save) */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-red-700 shadow-md">
                  Save
                </button>
              </div>

              {/* Title & User Info */}
              <div className="px-1 mb-4">
                <h3 className="font-bold text-gray-900 text-sm truncate leading-tight">
                  {project.title}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                      {project.user?.name
                        ? project.user.name[0].toUpperCase()
                        : "U"}
                    </div>
                    <p className="text-xs px-1.5 py-0.2 bg-gradient-to-tl from-stone-400 to-neutral-100 rounded-md   text-gray-500 truncate max-w-[100px]">
                      {project.user.name || "User"}
                    </p>
                  </div>
                  {project._count.likes > 0 && (
                    <span className="text-xs text-gray-400">
                      ❤️ {project._count.likes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
            <p className="text-lg font-medium">No pins found.</p>
            <p className="text-sm">Create one using the + button!</p>
          </div>
        )}
      </main>
    </div>
  );
}
