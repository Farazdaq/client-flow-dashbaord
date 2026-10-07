import { useEffect, useState } from "react";

import {
  getIntegrationStatus,
  saveFirebase,
  saveSupabase,
  setActiveBackend,
  removeIntegration,
  testFirebase,
  testSupabase,
  type IntegrationStatus,
  type BackendType,
  type FirebaseConfig,
  type SupabaseConfig,
} from "../services/integration";

interface ModalProps {
  backend: BackendType;
  mode: "integrate" | "edit";
  onClose: () => void;
  onSaved: () => void;
}

function IntegrationModal({ backend, mode, onClose, onSaved }: ModalProps) {
  const isFirebase = backend === "firebase";

  const [firebaseForm, setFirebaseForm] = useState<FirebaseConfig>({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  });

  const [supabaseForm, setSupabaseForm] = useState<SupabaseConfig>({
    url: "",
    publishableKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateFirebase(field: keyof FirebaseConfig, value: string) {
    setFirebaseForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateSupabase(field: keyof SupabaseConfig, value: string) {
    setSupabaseForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleTest() {
    try {
      setTesting(true);
      setError("");
      setSuccess("");

      if (isFirebase) {
        await testFirebase(firebaseForm);
      } else {
        await testSupabase(supabaseForm);
      }

      setSuccess(
        `${isFirebase ? "Firebase" : "Supabase"} connection successful.`,
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Connection failed.");
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (isFirebase) {
        await saveFirebase(firebaseForm);
      } else {
        await saveSupabase(supabaseForm);
      }

      setSuccess(
        `${isFirebase ? "Firebase" : "Supabase"} ${
          mode === "edit" ? "updated" : "integrated"
        } successfully.`,
      );

      setTimeout(() => {
        onSaved();
        onClose();
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save integration.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "edit"
                ? `Edit ${isFirebase ? "Firebase" : "Supabase"}`
                : `Integrate ${isFirebase ? "Firebase" : "Supabase"}`}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your {isFirebase ? "Firebase" : "Supabase"} project
              configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {isFirebase ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="API Key"
                value={firebaseForm.apiKey}
                onChange={(value) => updateFirebase("apiKey", value)}
              />

              <FormField
                label="Auth Domain"
                value={firebaseForm.authDomain}
                onChange={(value) => updateFirebase("authDomain", value)}
              />

              <FormField
                label="Project ID"
                value={firebaseForm.projectId}
                onChange={(value) => updateFirebase("projectId", value)}
              />

              <FormField
                label="Storage Bucket"
                value={firebaseForm.storageBucket}
                onChange={(value) => updateFirebase("storageBucket", value)}
              />

              <FormField
                label="Messaging Sender ID"
                value={firebaseForm.messagingSenderId}
                onChange={(value) => updateFirebase("messagingSenderId", value)}
              />

              <FormField
                label="App ID"
                value={firebaseForm.appId}
                onChange={(value) => updateFirebase("appId", value)}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FormField
                label="Supabase URL"
                value={supabaseForm.url}
                onChange={(value) => updateSupabase("url", value)}
                placeholder="https://your-project.supabase.co"
              />

              <FormField
                label="Publishable Key"
                type="password"
                value={supabaseForm.publishableKey}
                onChange={(value) => updateSupabase("publishableKey", value)}
              />
            </div>
          )}

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
            Configuration is sent to the server and stored securely. Credentials
            are not returned to the browser after saving.
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                  ? "Save Changes"
                  : "Integrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

interface RemoveModalProps {
  backend: BackendType;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function RemoveModal({
  backend,
  loading,
  onCancel,
  onConfirm,
}: RemoveModalProps) {
  const name = backend === "firebase" ? "Firebase" : "Supabase";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
          !
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Remove {name}?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          This removes the saved {name} connection from ClientFlow. The actual{" "}
          {name} project and its data will not be deleted.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Removing..." : "Remove Integration"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface IntegrationCardProps {
  backend: BackendType;
  connected: boolean;
  active: boolean;
  onIntegrate: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onActivate: () => void;
}

function IntegrationCard({
  backend,
  connected,
  active,
  onIntegrate,
  onEdit,
  onRemove,
  onActivate,
}: IntegrationCardProps) {
  const isFirebase = backend === "firebase";

  const name = isFirebase ? "Firebase" : "Supabase";

  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
        active ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"
      }`}
    >
      {active && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Active
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${
            isFirebase
              ? "bg-orange-50 text-orange-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isFirebase ? "F" : "S"}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{name}</h2>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />

            <span
              className={`text-xs font-semibold ${
                connected ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {connected ? "Connected" : "Not connected"}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-5 min-h-[48px] text-sm leading-6 text-slate-500">
        {isFirebase
          ? "Google's backend platform for database, authentication and cloud services."
          : "Postgres database and backend platform with authentication and APIs."}
      </p>

      {!connected ? (
        <button
          type="button"
          onClick={onIntegrate}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Integrate {name}
        </button>
      ) : (
        <div className="mt-6 flex gap-2">
          {!active && (
            <button
              type="button"
              onClick={onActivate}
              className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Make Active
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function IntegrationPage() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(false);

  const [modal, setModal] = useState<{
    backend: BackendType;
    mode: "integrate" | "edit";
  } | null>(null);

  const [removeTarget, setRemoveTarget] = useState<BackendType | null>(null);

  const [message, setMessage] = useState("");

  async function loadStatus() {
    try {
      setLoading(true);

      const result = await getIntegrationStatus();

      setStatus(result);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load integrations.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleActivate(backend: BackendType) {
    try {
      setActionLoading(true);
      setMessage("");

      await setActiveBackend(backend);

      await loadStatus();

      setMessage(
        `${backend === "firebase" ? "Firebase" : "Supabase"} is now active.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to activate backend.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemove() {
    if (!removeTarget) return;

    try {
      setActionLoading(true);
      setMessage("");

      const backend = removeTarget;

      await removeIntegration(backend);

      setRemoveTarget(null);

      await loadStatus();

      setMessage(
        `${backend === "firebase" ? "Firebase" : "Supabase"} integration removed.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove integration.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="text-sm text-slate-500">Loading integrations...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {message || "Unable to load integrations."}
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              Settings
            </p>

            <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>

            <p className="mt-2 text-sm text-slate-500">
              Connect Firebase or Supabase and switch between active backends.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active backend
            </p>

            <p className="mt-1 text-sm font-bold text-slate-900">
              {status.activeBackend
                ? status.activeBackend === "firebase"
                  ? "Firebase"
                  : "Supabase"
                : "None configured"}
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <IntegrationCard
            backend="firebase"
            connected={status.firebase.connected}
            active={status.activeBackend === "firebase"}
            onIntegrate={() =>
              setModal({
                backend: "firebase",
                mode: "integrate",
              })
            }
            onEdit={() =>
              setModal({
                backend: "firebase",
                mode: "edit",
              })
            }
            onRemove={() => setRemoveTarget("firebase")}
            onActivate={() => handleActivate("firebase")}
          />

          <IntegrationCard
            backend="supabase"
            connected={status.supabase.connected}
            active={status.activeBackend === "supabase"}
            onIntegrate={() =>
              setModal({
                backend: "supabase",
                mode: "integrate",
              })
            }
            onEdit={() =>
              setModal({
                backend: "supabase",
                mode: "edit",
              })
            }
            onRemove={() => setRemoveTarget("supabase")}
            onActivate={() => handleActivate("supabase")}
          />
        </div>
      </div>

      {modal && (
        <IntegrationModal
          backend={modal.backend}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSaved={loadStatus}
        />
      )}

      {removeTarget && (
        <RemoveModal
          backend={removeTarget}
          loading={actionLoading}
          onCancel={() => setRemoveTarget(null)}
          onConfirm={handleRemove}
        />
      )}
    </>
  );
}
