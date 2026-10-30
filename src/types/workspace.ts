export interface WorkspaceUser {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface WorkspaceMember {
  userId: string | WorkspaceUser;
  role: "owner" | "admin" | "manager" | "member";
  joinedAt?: string;
}

export interface WorkspaceInvitation {
  email: string;
  role?: "admin" | "manager" | "member";
  status: "pending" | "accepted" | "expired";
  expiresAt?: string;
  createdAt?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  ownerId?: string | WorkspaceUser;
  companySize?: string;
  role?: string;
  members?: WorkspaceMember[];
  invitations?: WorkspaceInvitation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkspaceInput {
  name: string;
  slug?: string;
  companySize?: string;
  role?: string;
}
