export type NotificationType =
  | "like"
  | "comment"
  | "review"
  | "favorite"
  | "watchlist";

export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  avatar?: string;
  message: string;
  movie?: string;
  time: string;
  read: boolean;
}