import { env } from "../config/env";

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

export interface IntegrationInfo {
  connected: boolean;
  configured: boolean;
}

export interface IntegrationStatus {
  activeBackend: BackendType | null;
  firebase: IntegrationInfo;
  supabase: IntegrationInfo;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  let result: any = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.message || "Request failed.");
  }

  return result as T;
}

export function getIntegrationStatus(): Promise<IntegrationStatus> {
  return request<IntegrationStatus>(`${env.apiUrl}/api/integration`);
}

export function saveFirebase(config: FirebaseConfig) {
  return request(`${env.apiUrl}/api/integration/firebase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
}

export function saveSupabase(config: SupabaseConfig) {
  return request(`${env.apiUrl}/api/integration/supabase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
}

export function setActiveBackend(backend: BackendType) {
  return request(`${env.apiUrl}/api/integration/active`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ backend }),
  });
}

export function removeIntegration(backend: BackendType) {
  return request(`${env.apiUrl}/api/integration/${backend}`, {
    method: "DELETE",
  });
}

export function testFirebase(config: FirebaseConfig) {
  return request(`${env.apiUrl}/api/integration/firebase/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
}

export function testSupabase(config: SupabaseConfig) {
  return request(`${env.apiUrl}/api/integration/supabase/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
}
