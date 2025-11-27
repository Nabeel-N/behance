"use client";
import Sidebar from "@repo/ui/Sidebar";
import PinModal from "@repo/ui/PinModal";
import { useState, useEffect, MouseEventHandler } from "react";

interface Project {
  id: number;
  title: string;
  image: string;
  user?: {
    id: number;
    name: string | null;
    profilePhoto?: String;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function App() {
  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [imageModal, SetimageModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

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

  async function viewImageById(projectId: number) {
    try {
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}`
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedImage(data.image);
        SetimageModal(true);
      } else {
        console.error("Failed to load specific image");
      }
    } catch (error) {
      console.error("Error fetching image by ID:", error);
    }
  }

  useEffect(() => {
    const handleEscapeKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && imageModal) {
        SetimageModal(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [imageModal]);

  async function handleSaveProject(e: React.MouseEvent, projectId: number) {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/projects/${projectId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar openvariable={plusiconModal} funOpenmodal={SetPlusIonModal} />

      {plusiconModal && <PinModal />}

      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => SetimageModal(false)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-h-[90vh] max-w-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-5 right-5 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            onClick={() => SetimageModal(false)}
          >
            &times;
          </button>
        </div>
      )}

      <main className="ml-24 p-6">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1600px]">
          {projects.map((project) => {
            const userName = project.user?.name || "User";
            const userInitial = userName.charAt(0).toUpperCase();

            return (
              <div
                key={project.id}
                className="break-inside-avoid relative group cursor-zoom-in"
                onClick={() => viewImageById(project.id)}
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

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-red-700 shadow-md"
                    onClick={(e) => handleSaveProject(e, project.id)}
                  >
                    Save
                  </button>
                </div>

                <div className="px-1 mb-4">
                  <h3 className="font-bold text-gray-200 text-sm truncate leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                        {userInitial}
                      </div>
                      <p className="text-xs px-2 py-0.5 bg-gray-800 rounded-md text-gray-400 truncate max-w-[100px]">
                        {userName}
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
            );
          })}
        </div>
      </main>
    </div>
  );
}
