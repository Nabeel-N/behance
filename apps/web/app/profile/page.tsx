"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PreviousIcon from "@repo/ui/PreviousIcon";
import Photo from "@repo/ui/Photo";
import Sidebar from "@repo/ui/Sidebar";

interface Project {
  id: number;
  title: string;
  image: string;
  published: boolean;
  user: {
    id: number;
    name: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface User {
  id: number;
  name: string | null;
  email: string;
  profilePhoto: string | null;
}

export default function ProfilePage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [savedproject, setSavedProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"created" | "saved">("created");

  async function fetchMyProjects() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/projects/mine", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching created projects:", error);
    }
  }

  async function fetchSavedProjects() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/projects/saved", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedProjects(data);
      }
    } catch (error) {
      console.error("Error fetching saved projects:", error);
    }
  }

  async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:4000/api/uploadimage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profilePhoto: base64String }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser((prev) =>
            prev ? { ...prev, profilePhoto: data.user.profilePhoto } : null
          );
        }
      } catch (e) {
        console.error("Error uploading profile photo:", e);
      }
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    Promise.all([
      fetchMyProjects(),
      fetchSavedProjects(),
      fetchUserProfile(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  const projectsToDisplay = activeTab === "created" ? projects : savedproject;
  const userName = user?.name || "Me";

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 ml-0 md:ml-24 p-6">
        <div className="flex flex-col items-center justify-center mb-12 mt-8">
          <Sidebar
            openvariable={plusiconModal}
            funOpenmodal={SetPlusIonModal}
          />

          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 mb-4 border-2 border-white shadow-sm overflow-hidden">
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Photo />
              )}
            </div>
            <label className="absolute bottom-4 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              ✏️
            </label>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
          <p className="text-gray-500 mt-2">
            @{userName?.toLowerCase().replace(" ", "")}
          </p>

          <div className="flex gap-4 mt-4 text-sm font-semibold">
            <span>{savedproject.length} saved</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="bg-gray-200 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition">
              Share
            </button>
            <button className="bg-gray-200 px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-8 mb-8 border-b border-transparent">
          <button
            onClick={() => setActiveTab("created")}
            className={`font-bold pb-2 transition ${
              activeTab === "created"
                ? "border-b-4 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`font-bold pb-2 transition ${
              activeTab === "saved"
                ? "border-b-4 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Image Grid Area */}
        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : projectsToDisplay.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            <p className="text-xl font-bold mb-2">Nothing to show here yet!</p>
            {activeTab === "created" && (
              <button
                onClick={() => router.push("/pin-creation-tool")}
                className="text-blue-600 font-bold hover:underline"
              >
                Create your first Pin
              </button>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1600px]">
            {/* Loop through projectsToDisplay (swaps automatically) */}
            {projectsToDisplay.map((project) => (
              <div
                key={project.id}
                className="break-inside-avoid relative group cursor-zoom-in"
              >
                <div className="rounded-2xl overflow-hidden mb-2 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full object-cover hover:brightness-90 transition-all duration-300"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/300?text=Error")
                    }
                  />

                  {activeTab === "created" && (
                    <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      ✏️
                    </button>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-sm truncate px-1">
                  {project.title}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
