"use client";

// 1. Define the shape of your data
interface Notification {
  id: number;
  text: string;
  time: string;
  image: string;
  isNew: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    text: "Your taste is next level",
    time: "8h",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: 2,
    text: "So iconic",
    time: "1d",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: 3,
    text: "Didn't know you needed this",
    time: "1d",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: 4,
    text: "Still searching? Explore ideas related to iPhone 11 Mud Cover",
    time: "1d",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=200&auto=format&fit=crop",
    isNew: false,
  },
];

export default function Notificationbar() {
  const newUpdates = NOTIFICATIONS.filter((n) => n.isNew);
  const seenUpdates = NOTIFICATIONS.filter((n) => !n.isNew);

  const isEmpty = newUpdates.length === 0 && seenUpdates.length === 0;

  return (
    <div className="w-[360px] bg-white rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col max-h-[85vh] overflow-y-auto pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-6 pb-2">
        <h2 className="text-xl font-bold text-gray-900">Updates</h2>
      </div>

      {/* Content List */}
      <div className="flex flex-col px-2">
        {/* 2. Empty State Handler */}
        {isEmpty && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No updates yet.
          </div>
        )}

        {/* New Section */}
        {newUpdates.length > 0 && (
          <div className="mb-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-900">
              New
            </h3>
            {newUpdates.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Seen Section */}
        {seenUpdates.length > 0 && (
          <div className="mb-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-900">
              Seen
            </h3>
            {seenUpdates.map((item) => (
              <NotificationItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 3. Proper Typing for the Sub-Component
function NotificationItem({ item }: { item: Notification }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer relative">
      {/* Image Thumbnail */}
      <div className="w-16 h-16 flex-shrink-0">
        <img
          src={item.image}
          alt="Notification thumbnail"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-gray-900 leading-snug break-words line-clamp-3">
          {item.text}
        </p>
      </div>

      {/* Time & Options */}
      <div className="flex flex-col items-end justify-between h-14 py-1">
        <span className="text-xs text-gray-500 font-medium">{item.time}</span>

        {/* Three Dots Icon */}
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
