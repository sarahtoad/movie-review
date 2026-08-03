export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  banner: string;
  bio?: string | null;
  location?: string | null;
  joinedAt: string;
}
