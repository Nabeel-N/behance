"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PreviousIcon from "@repo/ui/PreviousIcon";
import Photo from "@repo/ui/Photo";

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

export default function ProfilePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMyProjects() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

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
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchMyProjects();
  }, []);

  const userName = projects.length > 0 ? projects[0].user.name : "Me";
  const userInitial = userName ? userName[0].toUpperCase() : "M";

  async function updataProfile() {
    
  }

  return (
    <div className="flex min-h-screen bg-white">
      <span className="mt-8 ml-8">
        <PreviousIcon />
      </span>

      <main className="flex-1 ml-0 md:ml-24 p-6">
        <div className="flex flex-col items-center justify-center mb-12 mt-8">
          <div
            onClick={() => updataProfile}
            className="w-32 h-32 rounded-full  bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 mb-4 border-2 border-white shadow-sm"
          >
            <span>
              <Photo />
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
          <p className="text-gray-500 mt-2">
            @{userName?.toLowerCase().replace(" ", "")}
          </p>

          <div className="flex gap-4 mt-4 text-sm font-semibold">
            <span>{projects.length} saved</span>
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

        <div className="flex justify-center gap-8 mb-8 border-b border-transparent">
          <button className="font-bold border-b-4 border-black pb-2">
            Created
          </button>
          <button className="font-bold text-gray-500 pb-2 hover:text-black transition">
            Saved
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            <p className="text-xl font-bold mb-2">Nothing to show... yet!</p>
            <button
              onClick={() => router.push("/pin-creation-tool")}
              className="text-blue-600 font-bold hover:underline"
            >
              Create your first Pin
            </button>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mx-auto max-w-[1600px]">
            {projects.map((project) => (
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
                  {/* Edit Button for Owner */}
                  <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    ✏️
                  </button>
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
