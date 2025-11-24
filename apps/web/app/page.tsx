"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router
import Button from "@repo/ui/button";
import CreatePinModal from "@repo/ui/CreatePin";
import EditIcon from "@repo/ui/Editicon";

interface Project {
  id: string | number;
  title: string;
  image: string;
  user: {
    id: number | string;
    name: string;
  };
  _count: {
    like: number;
    comment: number;
  };
}

export default function Page() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

  // State
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [viewImage, setViewImage] = useState<string | null>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch Projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  function handleOpenCreate() {
    setEditingProject(null);
    setOpenModal(true);
  }

  function handleOpenEdit(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setEditingProject(project);
    setOpenModal(true);
  }

  function openImageViewer(image: string) {
    setViewImage(image);
  }

  function closeImageViewer() {
    setViewImage(null);
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navigation */}
      <div className="flex items-center justify-center w-full mt-6 mb-6">
        <nav className="flex justify-between items-center w-3/4 bg-blue-500 px-6 py-4 rounded-full shadow-lg">
          <span className="text-white font-bold text-xl">BehanceClone</span>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl transition"
            onClick={handleOpenCreate}
          >
            Create Pin
          </Button>
        </nav>
      </div>

      {/* Create/Edit Modal */}
      {openModal && (
        <CreatePinModal
          initialdata={editingProject}
          onPinCreated={fetchData}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Image Viewer Modal (Moved Outside Loop) */}
      {viewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-10"
          onClick={closeImageViewer}
        >
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <img
              src={viewImage}
              alt="Preview"
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 text-white text-xl font-bold bg-gray-800/50 rounded-full w-10 h-10"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            Loading projects...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => openImageViewer(p.image)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group cursor-zoom-in"
              >
                {/* Edit Button */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className="cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-700"
                    onClick={(e) => handleOpenEdit(e, p)}
                  >
                    <EditIcon />
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative h-64 w-full bg-gray-200">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Card Details */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {p.title}
                  </h3>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold uppercase">
                        {p.user.name[0]}
                      </div>
                      <span className="font-medium truncate max-w-[100px]">
                        {p.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
                      <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        ❤️ {p._count.like}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        💬 {p._count.comment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
