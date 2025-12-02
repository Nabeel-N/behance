"use client";

import Sidebar from "@repo/ui/Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function PinCreationToolContent() {
  const [title, SetTitle] = useState<string>("");
  const [image, Setimage] = useState<string>("");
  const [description, Setdescription] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plusiconModal, SetPlusIonModal] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const editMode = searchParams.get("mode") === "edit";
  const projectId = searchParams.get("projectId");
  const [notificationModal, SetNotificationModal] = useState<boolean>(false);

  useEffect(() => {
    if (editMode && projectId) {
      async function fetchProjectData() {
        try {
          // 👇 Updated
          const response = await fetch(`${API_URL}/api/projects/${projectId}`);
          if (response.ok) {
            const data = await response.json();
            SetTitle(data.title);
            Setdescription(data.description || "");
            Setimage(data.image);
            setPreviewImage(data.image);
          }
        } catch (error) {
          console.error("Failed to load project for editing");
        }
      }
      fetchProjectData();
    }
  }, [editMode, projectId]);

  async function handlePublish() {
    const token = localStorage.getItem("token");
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
      // 👇 Updated
      const url = editMode
        ? `${API_URL}/api/projects/${projectId}`
        : `${API_URL}/api/projects`;

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
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
        alert(
          editMode ? "Pin Updated Successfully!" : "Pin Created Successfully!"
        );
        router.push("/profile");
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating/updating pin:", error);
      alert("Something went wrong.");
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
    if (file.size > 20 * 1024 * 1024)
      return alert("File size must be less than 20MB");
    if (!file.type.startsWith("image/"))
      return alert("Please upload an image file");
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      Setimage(base64String);
    };
    reader.readAsDataURL(file);
  }
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      uploadImageClick({ target: fileInputRef.current } as any);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-0 md:p-6 w-full ml-0 md:ml-24">
        <Sidebar
          openvariable={plusiconModal}
          funOpenmodal={SetPlusIonModal}
          noficaiton={notificationModal}
          fnnotifi_modal={SetNotificationModal}
        />

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 md:border-none">
          <h1 className="text-xl font-bold text-gray-900">
            {editMode ? "Edit Pin" : "Create Pin"}
          </h1>

          <button
            onClick={handlePublish}
            disabled={isUploading}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-full hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Saving..." : editMode ? "Save Changes" : "Publish"}
          </button>
        </div>

        <div className="flex justify-center mt-4">
          <div className="w-full max-w-[880px] bg-white md:rounded-[32px] md:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* LEFT COLUMN - Image Upload */}
              <div className="w-full md:w-[375px] p-5 md:p-10 flex flex-col gap-6">
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
                    <div className="flex flex-col items-center">
                      <p className="text-gray-900 font-medium mb-2">
                        Choose a file
                      </p>
                      <p className="text-xs text-gray-500">
                        jpg/png less than 20MB
                      </p>
                    </div>
                  )}
                </div>
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

                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 ml-1">
                    Description
                  </label>
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <textarea
                      onChange={(e) => Setdescription(e.target.value)}
                      value={description}
                      placeholder="Add a detailed description"
                      className="w-full bg-transparent resize-none outline-none text-sm placeholder:text-gray-500 h-24"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs text-gray-600 ml-1">
                    Link
                  </label>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PinCreationTool() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <PinCreationToolContent />
    </Suspense>
  );
}
