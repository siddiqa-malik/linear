export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "user";
  createdAt: string;
}

export interface UserSettings {
  _id?: string;
  userId: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  taskReminders: boolean;
  compactView: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}