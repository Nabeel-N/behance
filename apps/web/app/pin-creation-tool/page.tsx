"use client";

import Sidebar from "@repo/ui/Sidebar";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function PinCreationTool() {
  const [title, SetTitle] = useState<string>("");
  const [image, Setimage] = useState<string>("");
  const [description, Setdescription] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const router = useRouter();

  async function handlePublish() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("Bearer");
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!title || !image) {
      alert("Please provide a Title and an Image URL or upload an image");
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch("http://localhost:4000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          image: image,
          description: description,
        }),
      });

      if (response.ok) {
        alert("Pin Created Successfully!");
        router.push("/");
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating pin:", error);
      alert("Something went wrong. Is the backend running on port 4000?");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileInputClick() {
    fileInputRef.current?.click();
  }

  async function uploadImageClick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File size must be less than 20MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;

      setPreviewImage(base64String);
      Setimage(base64String);
    };

    reader.onerror = () => {
      alert("Failed to read file");
    };

    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        uploadImageClick({ target: fileInputRef.current } as any);
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-0 md:p-6 w-full ml-0 md:ml-24">
        {/* Top Header */}
        <Sidebar openvariable={plusiconModal} funOpenmodal={SetPlusIonModal} />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 md:border-none">
          <h1 className="text-xl font-bold text-gray-900">Create Pin</h1>

          <button
            onClick={handlePublish}
            disabled={isUploading}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Publishing..." : "Publish"}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex justify-center mt-4">
          <div className="w-full max-w-[880px] bg-white md:rounded-[32px] md:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* LEFT COLUMN - Image Upload */}
              <div className="w-full md:w-[375px] p-5 md:p-10 flex flex-col gap-6">
                {/* Upload Box */}
                <div
                  onClick={handleFileInputClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="bg-gray-100 rounded-[32px] h-[450px] border-2 border-dashed border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer relative flex flex-col items-center justify-center text-center p-6 group overflow-hidden"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={uploadImageClick}
                  />

                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-[32px]"
                    />
                  ) : (
                    <>
                      <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-900 font-medium mb-8 px-4">
                        Choose a file or drag and drop it here
                      </p>

                      <p className="text-xs text-gray-500 max-w-[200px] absolute bottom-8">
                        We recommend using high-quality .jpg files less than 20
                        MB or .mp4 files less than 200 MB.
                      </p>
                    </>
                  )}
                </div>

                {/* Save from URL Button */}
                <button
                  onClick={() => {
                    const url = prompt("Enter image URL:");
                    if (url) {
                      Setimage(url);
                      setPreviewImage(url);
                    }
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 rounded-full transition-colors"
                >
                  Save from URL
                </button>
              </div>

              {/* RIGHT COLUMN - Form Fields */}
              <div className="flex-1 p-5 md:p-10 flex flex-col gap-6">
                {/* Title Input */}
                <div className="group">
                  <label className="block text-xs text-gray-600 mb-1 ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Add a title"
                    className="w-full text-lg font-bold placeholder:text-gray-400 border-b border-gray-300 py-2 focus:border-blue-500 focus:outline-none transition-colors"
                    onChange={(e) => SetTitle(e.target.value)}
                    value={title}
                  />
                </div>

                {/* User Info (Static for now) */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <span className="font-bold text-sm text-gray-900">
                    User Name
                  </span>
                </div>

                {/* Description Input */}
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 ml-1">
                    Description
                  </label>
                  <div className="bg-gray-100 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-gray-300">
                    <textarea
                      onChange={(e) => Setdescription(e.target.value)}
                      value={description}
                      placeholder="Add a detailed description"
                      className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-gray-500 h-24"
                    />
                  </div>
                </div>

                {/* Link Input */}
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 ml-1">
                    Link
                  </label>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-gray-300">
                    <input
                      type="text"
                      placeholder="Add Image Link"
                      className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
                      onChange={(e) => {
                        Setimage(e.target.value);
                        setPreviewImage(e.target.value);
                      }}
                      value={image}
                    />
                  </div>
                </div>

                {/* Tagged Topics */}
                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 ml-1">
                    Tagged topics (0)
                  </label>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-gray-300">
                    <input
                      type="text"
                      placeholder="Search for a tag"
                      className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
