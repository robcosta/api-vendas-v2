export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  getAvatarUrl(): string | null;
  created_at: Date;
  updated_at: Date;
}
