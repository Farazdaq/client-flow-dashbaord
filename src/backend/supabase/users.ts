import type { SupabaseClient } from "@supabase/supabase-js";

import type { User } from "../types.ts";

export function createSupabaseUsers(client: SupabaseClient) {
  return {
    async list(): Promise<User[]> {
      const { data, error } = await client.from("users").select("*");

      if (error) {
        throw error;
      }

      return data as User[];
    },

    async get(id: string): Promise<User | null> {
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as User | null;
    },

    async create(user: Omit<User, "id">): Promise<User> {
      const { data, error } = await client
        .from("users")
        .insert(user)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    },

    async update(id: string, changes: Partial<User>): Promise<User> {
      const { data, error } = await client
        .from("users")
        .update(changes)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as User;
    },

    async delete(id: string): Promise<void> {
      const { error } = await client.from("users").delete().eq("id", id);

      if (error) {
        throw error;
      }
    },
  };
}
