import { Notification } from "@/types/notification";
import {
  Heart,
  MessageCircle,
  Star,
  Film,
  Eye,
} from "lucide-react";

interface Props {
  notification: Notification;
}

export default function NotificationCard({ notification }: Props) {
  const icons = {
    like: <Heart size={16} />,
    comment: <MessageCircle size={16} />,
    review: <Star size={16} />,
    favorite: <Film size={16} />,
    watchlist: <Eye size={16} />,
  };

  return (
    <div
      className={`flex gap-4 rounded-md border p-4 transition ${
        notification.read
          ? "border-border bg-surface"
          : "border-accent/30 bg-elevated"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-accent">
        {icons[notification.type]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed text-soft">
          <span className="font-semibold text-white">{notification.user}</span>{" "}
          {notification.message}
        </p>

        {notification.movie && (
          <p className="mt-1.5 text-sm font-medium text-accent">
            {notification.movie}
          </p>
        )}

        <p className="mt-2 text-xs text-muted">{notification.time}</p>
      </div>

      {!notification.read && (
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
      )}
    </div>
  );
}
