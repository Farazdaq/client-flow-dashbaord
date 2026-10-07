import type { Backend } from "./types.ts";

import { createFirebaseBackend } from "./firebase/backend";

import { createSupabaseBackend } from "./supabase/backend";

export interface IntegrationRuntimeConfig {
  activeBackend: "firebase" | "supabase" | null;

  firebase: {
    enabled: boolean;
    connected: boolean;
    config: any | null;
  };

  supabase: {
    enabled: boolean;
    connected: boolean;
    config: any | null;
  };
}

export function createBackend(config: IntegrationRuntimeConfig): Backend {
  if (config.activeBackend === "firebase") {
    if (!config.firebase.config) {
      throw new Error("Firebase is not configured.");
    }

    return createFirebaseBackend(config.firebase.config);
  }

  if (config.activeBackend === "supabase") {
    if (!config.supabase.config) {
      throw new Error("Supabase is not configured.");
    }

    return createSupabaseBackend(config.supabase.config);
  }

  throw new Error("No active backend configured.");
}
