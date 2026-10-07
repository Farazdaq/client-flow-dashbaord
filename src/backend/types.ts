export type BackendType = "firebase" | "supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Backend {
  type: BackendType;

  users: {
    list(): Promise<User[]>;

    get(id: string): Promise<User | null>;

    create(user: Omit<User, "id">): Promise<User>;

    update(id: string, data: Partial<User>): Promise<User>;

    delete(id: string): Promise<void>;
  };
}
