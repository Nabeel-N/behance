"use client";

import { ReactNode, useEffect, useState } from "react";

interface Project {
  id: number | string;
  title: string;
  image: string;
  createdAt: string;
  user: {
    id: number | string;
    name: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function FeedPage() {
  // --- Main Data State ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Create State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // --- Edit State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // --- Delete State (The New Functionality) ---
  // If this is not null, the delete modal is open for this specific ID
  const [deleteProjectId, setDeleteProjectId] = useState<number | string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await res.json();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- Create Project Handler ---
  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim() || !image.trim()) {
      setCreateError("Please provide both a title and an image URL.");
      return;
    }

    const token = localStorage.getItem("bhance_token");
    if (!token) {
      setCreateError("You must be logged in to create a pin.");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      setIsCreateModalOpen(false);
      setTitle("");
      setImage("");
      fetchProjects();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  }

  // --- Edit project flow ---
  function openEditModal(project: Project) {
    setEditingProjectId(project.id);
    setEditTitle(project.title);
    setEditImage(project.image);
    setEditError(null);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setEditingProjectId(null);
    setEditTitle("");
    setEditImage("");
    setEditError(null);
    setIsEditModalOpen(false);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditError(null);

    if (!editingProjectId) return setEditError("No project selected");

    if (!editTitle.trim() && !editImage.trim()) {
      setEditError("Provide a new title or image.");
      return;
    }

    const token = localStorage.getItem("bhance_token");
    if (!token) {
      setEditError("You must be logged in to edit a pin.");
      return;
    }

    setIsEditing(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${editingProjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, image: editImage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to edit project");

      closeEditModal();
      fetchProjects();
    } catch (err: any) {
      setEditError(err.message || "Failed to edit project");
    } finally {
      setIsEditing(false);
    }
  }

  // --- DELETE LOGIC ---

  // 1. Opens the modal
  function promptDelete(id: number | string) {
    setDeleteProjectId(id);
  }

  

  // 2. Closes the modal
  function cancelDelete() {
    setDeleteProjectId(null);
  }

  // 3. Performs the actual API call
  async function confirmDelete() {
    if (!deleteProjectId) return;

    const token = localStorage.getItem("bhance_token");
    if (!token) {
      alert("You must be logged in to delete a pin.");
      setDeleteProjectId(null);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects/${deleteProjectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      
      // Refresh list and close modal
      fetchProjects();
      setDeleteProjectId(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleCreateModal() {
    setIsCreateModalOpen(!isCreateModalOpen);
    setCreateError(null);
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* --- Navigation Bar --- */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              BehanceClone
            </span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/auth"
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Login
            </a>
            <Button buttonclick={toggleCreateModal}>Create Pin</Button>
          </div>
        </div>
      </nav>

      {/* --- CREATE PIN MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Create New Pin
              </h2>
              <button
                onClick={toggleCreateModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What are you sharing?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              {image && (
                <div className="mt-2 aspect-video bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}

              {createError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {createError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleCreateModal}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? "Creating..." : "Create Pin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PIN MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Pin</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="What are you sharing?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              {editImage && (
                <div className="mt-2 aspect-video bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}

              {editError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {editError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL (NEW) --- */}
      {deleteProjectId && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
             
             <div className="p-6 text-center">
               <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Pin?</h2>
               <p className="text-gray-600 mb-6">
                 Are you sure you want to delete this pin? This action cannot be undone.
               </p>
               
               <div className="flex gap-3 justify-center">
                 <button
                   onClick={cancelDelete}
                   className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                 >
                   No, Keep it
                 </button>
                 <button
                   onClick={confirmDelete}
                   disabled={isDeleting}
                   className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                 >
                   {isDeleting ? "Deleting..." : "Yes, Delete"}
                 </button>
               </div>
             </div>
             
           </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <div className="bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-red-500 hover:underline font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-2xl font-bold text-gray-900">No pins yet</h3>
            <p className="mt-2 text-lg">
              Be the first to share your inspiration!
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Create one now
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="break-inside-avoid mb-4">
                <div className="group cursor-pointer relative hover:-translate-y-2 transition-transform duration-300 ease-out">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-md hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x600?text=No+Image";
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex justify-end gap-2">
                        <button
                          className="bg-red-600 text-white py-2 px-3 rounded-full text-xs font-semibold shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            promptDelete(project.id);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          className="bg-white/20 text-white py-2 px-3 rounded-full text-xs font-semibold shadow-lg hover:bg-white/40 active:scale-95 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(project);
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="bg-red-600 text-white py-3 px-5 rounded-full text-sm font-semibold shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            /* Save action placeholder */
                          }}
                        >
                          Save
                        </button>
                      </div>

                      <div>
                        <h3 className="text-white font-bold text-base mb-1 drop-shadow-lg">
                          {project.title}
                        </h3>
                        <p className="text-white/90 text-sm drop-shadow-lg">
                          {project.user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Button Component ---
interface ButtonProps {
  buttonclick: () => void;
  children: ReactNode;
}

function Button({ buttonclick, children }: ButtonProps) {
  return (
    <button
      className="bg-yellow-400 px-6 py-3 rounded-xl font-bold text-black shadow-sm hover:bg-yellow-500 transition-all active:scale-95"
      onClick={buttonclick}
    >
      {children}
    </button>
  );
}