"use client";

interface User {
  id: number;
  name: string | null;
  profilePhoto?: string;
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

interface NotificationbarProps {
  projects: Project[];
}

export default function Notificationbar({ projects }: NotificationbarProps) {
  const latestProject = projects.slice(0, 1);
  const olderProjects = projects.slice(1);

  const isEmpty = projects.length === 0;

  return (
    <div className="w-[360px] bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col max-h-[85vh] overflow-y-auto pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-6 pb-2">
        <h2 className="text-xl font-bold text-gray-900">Updates</h2>
      </div>

      {/* Content List */}
      <div className="flex flex-col px-2">
        {isEmpty && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No updates yet.
          </div>
        )}

        {/* New Section */}
        {latestProject.length > 0 && (
          <div className="mb-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-900">
              New
            </h3>
            {latestProject.map((project) => (
              <NotificationItem
                key={project.id}
                title={project.title}
                image={project.image}
                time="Just now"
              />
            ))}
          </div>
        )}

        {/* Seen Section */}
        {olderProjects.length > 0 && (
          <div className="mb-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-900">
              Seen
            </h3>
            {olderProjects.map((project) => (
              <NotificationItem
                key={project.id}
                title={project.title}
                image={project.image}
                time="Recent"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({
  title,
  image,
  time,
}: {
  title: string;
  image: string;
  time: string;
}) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer relative">
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={image}
          alt="Notification thumbnail"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-gray-900 leading-snug break-words line-clamp-3">
          <span className="font-bold">You</span> uploaded: {title}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between h-14 py-1">
        <span className="text-xs text-gray-500 font-medium">{time}</span>
        <button className="text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
