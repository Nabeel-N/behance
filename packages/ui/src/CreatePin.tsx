"use client";
import { useState } from "react";

interface ProjectData {
  id: string | number;
  title: string;
  image: string;
}

interface ModalProps {
  onClose?: () => void;
  onPinCreated: () => void;
  initialdata?: ProjectData | null;
}

export default function CreatePinModal({
  onClose,
  onPinCreated,
  initialdata,
}: ModalProps) {
  const [title, setTitle] = useState<string>(initialdata?.title || "");
  const [image, setImage] = useState<string>(initialdata?.image || "");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialdata;

  async function formsubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    if (!title.trim() || !image.trim()) {
      setCreateError("Please provide both a title and an image URL.");
      return;
    }

    const token = localStorage.getItem("bhance_token");
    if (!token) {
      setCreateError("You must be logged in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

      const url = isEditing
        ? `${API_BASE}/api/projects/${initialdata?.id}`
        : `${API_BASE}/api/projects`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save project");
      }

      onPinCreated();
      if (onClose) onClose();
    } catch (error: any) {
      setCreateError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-md border border-neutral-700">
        <h2 className="text-white text-2xl font-bold mb-6">
          {isEditing ? "Edit Pin" : "Create New Pin"}
        </h2>

        <form onSubmit={formsubmit} className="flex flex-col gap-4">
          {createError && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm">
              {createError}
            </div>
          )}

          <input
            className="p-3 rounded bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 outline-none"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="p-3 rounded bg-neutral-800 text-white border border-neutral-700 focus:border-blue-500 outline-none"
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Pin"
                : "Create Pin"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
