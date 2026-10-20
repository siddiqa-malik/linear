export interface WorkspaceMember {
  userId: string;
  role: "owner" | "admin" | "manager" | "member";
  joinedAt?: string;
}

export interface Workspace {
  _id: string;
  name: string;
  slug: string;
  ownerId?: string;
  companySize?: string;
  role?: string;
  members?: WorkspaceMember[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkspaceInput {
  name: string;
  slug?: string;
  companySize?: string;
  role?: string;
}
