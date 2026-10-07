import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export type BackendType = "firebase" | "supabase";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface SupabaseConfig {
  url: string;
  publishableKey: string;
}

export interface StoredIntegration {
  activeBackend: BackendType | null;

  firebase: {
    enabled: boolean;
    connected: boolean;
    config: string | null;
  };

  supabase: {
    enabled: boolean;
    connected: boolean;
    config: string | null;
  };

  sync: {
    enabled: boolean;
    mode: "manual" | "automatic";
    lastSyncAt: string | null;
  };
}

const dataDirectory = path.join(process.cwd(), "data");

const filePath = path.join(dataDirectory, "integration.json");

function getEncryptionKey(): Buffer {
  const value = process.env.ENCRYPTION_KEY;

  if (!value) {
    throw new Error("ENCRYPTION_KEY is missing.");
  }

  const key = Buffer.from(value, "hex");

  if (key.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes.");
  }

  return key;
}

function encrypt(value: unknown): string {
  const key = getEncryptionKey();

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  const plaintext = JSON.stringify(value);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

function decrypt<T>(value: string): T {
  const parts = value.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid encrypted configuration.");
  }

  const [ivValue, authTagValue, encryptedValue] = parts;

  const key = getEncryptionKey();

  const iv = Buffer.from(ivValue, "base64");

  const authTag = Buffer.from(authTagValue, "base64");

  const encrypted = Buffer.from(encryptedValue, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as T;
}

function createInitialStore(): StoredIntegration {
  return {
    activeBackend: null,

    firebase: {
      enabled: false,
      connected: false,
      config: null,
    },

    supabase: {
      enabled: false,
      connected: false,
      config: null,
    },

    sync: {
      enabled: false,
      mode: "manual",
      lastSyncAt: null,
    },
  };
}

async function ensureStore(): Promise<void> {
  await fs.mkdir(dataDirectory, {
    recursive: true,
  });

  try {
    await fs.access(filePath);
  } catch {
    const initial = createInitialStore();

    await fs.writeFile(filePath, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readStore(): Promise<StoredIntegration> {
  await ensureStore();

  const content = await fs.readFile(filePath, "utf8");

  try {
    return JSON.parse(content) as StoredIntegration;
  } catch {
    throw new Error("integration.json contains invalid JSON.");
  }
}

async function writeStore(value: StoredIntegration): Promise<void> {
  await ensureStore();

  const temporaryPath = `${filePath}.tmp`;

  await fs.writeFile(temporaryPath, JSON.stringify(value, null, 2), "utf8");

  await fs.rename(temporaryPath, filePath);
}

export async function saveFirebase(config: FirebaseConfig): Promise<void> {
  const store = await readStore();

  store.firebase = {
    enabled: true,
    connected: true,
    config: encrypt(config),
  };

  if (!store.activeBackend) {
    store.activeBackend = "firebase";
  }

  await writeStore(store);
}

export async function saveSupabase(config: SupabaseConfig): Promise<void> {
  const store = await readStore();

  store.supabase = {
    enabled: true,
    connected: true,
    config: encrypt(config),
  };

  if (!store.activeBackend) {
    store.activeBackend = "supabase";
  }

  await writeStore(store);
}

export async function getIntegration(): Promise<StoredIntegration> {
  return readStore();
}

export async function getDecryptedIntegration() {
  const store = await readStore();

  return {
    ...store,

    firebase: {
      ...store.firebase,

      config: store.firebase.config
        ? decrypt<FirebaseConfig>(store.firebase.config)
        : null,
    },

    supabase: {
      ...store.supabase,

      config: store.supabase.config
        ? decrypt<SupabaseConfig>(store.supabase.config)
        : null,
    },
  };
}

export async function setActiveBackend(backend: BackendType): Promise<void> {
  const store = await readStore();

  if (backend === "firebase" && !store.firebase.connected) {
    throw new Error("Firebase is not connected.");
  }

  if (backend === "supabase" && !store.supabase.connected) {
    throw new Error("Supabase is not connected.");
  }

  store.activeBackend = backend;

  await writeStore(store);
}

export async function removeIntegration(backend: BackendType): Promise<void> {
  const store = await readStore();

  if (backend === "firebase") {
    store.firebase = {
      enabled: false,
      connected: false,
      config: null,
    };
  }

  if (backend === "supabase") {
    store.supabase = {
      enabled: false,
      connected: false,
      config: null,
    };
  }

  if (store.activeBackend === backend) {
    const otherBackend = backend === "firebase" ? "supabase" : "firebase";

    if (store[otherBackend].connected) {
      store.activeBackend = otherBackend;
    } else {
      store.activeBackend = null;
    }
  }

  await writeStore(store);
}

export async function setSyncSettings(
  enabled: boolean,
  mode: "manual" | "automatic",
): Promise<void> {
  const store = await readStore();

  store.sync.enabled = enabled;

  store.sync.mode = mode;

  await writeStore(store);
}

export async function updateLastSync(): Promise<void> {
  const store = await readStore();

  store.sync.lastSyncAt = new Date().toISOString();

  await writeStore(store);
}

export async function getActiveBackend(): Promise<BackendType | null> {
  const store = await readStore();

  return store.activeBackend;
}

export async function getActiveBackendConfig() {
  const store = await getDecryptedIntegration();

  if (store.activeBackend === "firebase") {
    if (!store.firebase.connected || !store.firebase.config) {
      throw new Error("Firebase is not connected.");
    }

    return {
      backend: "firebase" as const,
      config: store.firebase.config,
    };
  }

  if (store.activeBackend === "supabase") {
    if (!store.supabase.connected || !store.supabase.config) {
      throw new Error("Supabase is not connected.");
    }

    return {
      backend: "supabase" as const,
      config: store.supabase.config,
    };
  }

  throw new Error("No active backend is configured.");
}
