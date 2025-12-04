"use client";
import Sidebar from "@repo/ui/Sidebar";
import PinModal from "@repo/ui/PinModal";
import { useState, useEffect } from "react";
import Likeicon from "@repo/ui/Likeicon";
import Searchbar from "@repo/ui/Searchbar";
import CommentIcon from "@repo/ui/CommentIcon";

interface User {
  id: number;
  name: string | null;
  profilePhoto?: string;
}

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: User;
}

interface Project {
  id: number;
  title: string;
  image: string;
  description?: string;
  user?: User;
  isLiked?: boolean;
  _count: {
    likes: number;
    comments: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function App() {
  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const [query, setQuery] = useState("");

  async function fetchProjects() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
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

  async function openProjectModal(project: Project) {
    setSelectedProject(project);
    setIsModalOpen(true);
    setComments([]);

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const resComments = await fetch(
        `${API_URL}/api/projects/${project.id}/comments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (resComments.ok) {
        const data = await resComments.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedProject(null);
    setCommentText("");
  }

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isModalOpen]);

  async function handleSaveProject(e: React.MouseEvent, projectId: number) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) alert("Saved to profile");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  }

  async function handleLike(e: React.MouseEvent, projectId: number) {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const isLikedNow = data.liked;

        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  isLiked: isLikedNow,
                  _count: {
                    ...p._count,
                    likes: isLikedNow ? p._count.likes + 1 : p._count.likes - 1,
                  },
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking:", error);
    }
  }

  async function handleSendComment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !commentText.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${selectedProject.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment]);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id
              ? {
                  ...p,
                  _count: { ...p._count, comments: p._count.comments + 1 },
                }
              : p
          )
        );
        setCommentText("");
      }
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Sidebar
        openvariable={plusiconModal}
        funOpenmodal={SetPlusIonModal}
        projects={projects}
      />
      {plusiconModal && <PinModal />}

      {/* --- SPLIT VIEW MODAL --- */}
      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT SIDE: Image */}
            <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="max-h-full max-w-full object-contain"
              />
              {/* Mobile Close Button */}
              <button
                className="absolute top-4 left-4 md:hidden text-white bg-black/50 p-2 rounded-full"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {/* RIGHT SIDE: Details & Comments */}
            <div className="w-full md:w-[400px] bg-zinc-900 flex flex-col border-l border-zinc-800">
              {/* Header */}
              <div className="p-5 border-b border-zinc-800 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                      {selectedProject.user?.name?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    <span className="text-sm text-gray-400">
                      {selectedProject.user?.name || "Unknown User"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center mt-10">
                    No comments yet. Be the first to say something!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                        {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-200">
                          {comment.user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-400 leading-relaxed break-words">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between mb-4 text-sm text-gray-400 px-1">
                  <span>{selectedProject._count.likes} Likes</span>
                  <span>{selectedProject._count.comments} Comments</span>
                </div>

                <form onSubmit={handleSendComment} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-zinc-800 text-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-600 placeholder-gray-500"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN GRID --- */}
      <main className="ml-24 p-6">
        <div className="mt-2 mb-8 flex justify-center">
          <Searchbar query={query} Setquery={setQuery} />
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1600px]">
          {filteredProjects.map((project) => {
            const userName = project.user?.name || "User";
            const userInitial = userName.charAt(0).toUpperCase();

            return (
              <div
                key={project.id}
                className="break-inside-avoid relative group mb-6"
                onClick={() => openProjectModal(project)}
              >
                <div className="rounded-xl overflow-hidden mb-3 bg-gray-900 cursor-zoom-in">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full object-cover hover:brightness-75 transition-all duration-300"
                  />
                  {/* Hover Save Button */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-full text-xs hover:bg-red-700 shadow-md"
                      onClick={(e) => handleSaveProject(e, project.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="px-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-200 text-sm truncate">
                      {project.title}
                    </h3>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-800 font-bold">
                        {userInitial}
                      </div>
                      <p className="text-xs text-gray-400 truncate max-w-[80px]">
                        {userName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Like Section */}
                      <div className="flex items-center gap-1">
                        <Likeicon
                          onClick={(e) => handleLike(e, project.id)}
                          liked={project.isLiked || false}
                        />
                        {project._count.likes > 0 && (
                          <span className="text-xs text-gray-400">
                            {project._count.likes}
                          </span>
                        )}
                      </div>

                      {/* Comment Section */}
                      <div className="flex items-center gap-1">
                        <div
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProjectModal(project);
                          }}
                        >
                          <CommentIcon />
                        </div>
                        {project._count.comments > 0 && (
                          <span className="text-xs text-gray-400">
                            {project._count.comments}
                          </span>
                        )}
                      </div>
                    </div>
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
