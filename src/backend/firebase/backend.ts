import type { Backend } from "../types.ts";

import type { FirebaseConfig } from "./client";

import { createFirebaseClient } from "./client";

import { createFirebaseUsers } from "./users";

export function createFirebaseBackend(config: FirebaseConfig): Backend {
  const { db } = createFirebaseClient(config);

  return {
    type: "firebase",

    users: createFirebaseUsers(db),
  };
}
