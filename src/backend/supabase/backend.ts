import type { Backend } from "../types.ts";

import type { SupabaseConfig } from "./client";

import { createSupabaseClient } from "./client";

import { createSupabaseUsers } from "./users";

export function createSupabaseBackend(config: SupabaseConfig): Backend {
  const client = createSupabaseClient(config);

  return {
    type: "supabase",

    users: createSupabaseUsers(client),
  };
}
