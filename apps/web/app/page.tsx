"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function getToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("bhance_token")
      : null;
  }

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !image.trim()) {
      setError("Please provide both a title and an image URL.");
      return;
    }

    if (!isValidUrl(image)) {
      setError("Image must be a valid URL (https://...).");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("You must be signed in to create a project.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), image: image.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create project");

      setSuccess("Project created successfully.");
      setTitle("");
      setImage("");

      setTimeout(() => router.push("/"), 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-6 rounded shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Create a Project</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome project"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Image URL
              </label>
              <input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://.../image.jpg"
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Currently accepts an image URL. Want file upload? I can add it.
              </p>
            </div>

            {image && isValidUrl(image) && (
              <div className="border rounded-md overflow-hidden mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create project"}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Cancel
              </button>

              {success && (
                <div className="text-sm text-green-600">{success}</div>
              )}
            </div>

            {error && <div className="text-sm text-red-600 pt-2">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
