import "dotenv/config";
import express from "express";
import cors from "cors";

import {
  getIntegration,
  saveFirebase,
  saveSupabase,
  setActiveBackend,
} from "./integrationStore";

const app = express();

const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/integration", async (_req, res) => {
  try {
    const store = await getIntegration();

    res.json({
      activeBackend: store.activeBackend,

      firebase: {
        enabled: store.firebase.enabled,
        connected: store.firebase.connected,
      },

      supabase: {
        enabled: store.supabase.enabled,
        connected: store.supabase.connected,
      },

      sync: store.sync,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load integration status.",
    });
  }
});

app.post("/api/integration/firebase", async (req, res) => {
  try {
    const {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    } = req.body;

    if (
      !apiKey ||
      !authDomain ||
      !projectId ||
      !storageBucket ||
      !messagingSenderId ||
      !appId
    ) {
      return res.status(400).json({
        message: "All Firebase configuration fields are required.",
      });
    }

    await saveFirebase({
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    });

    res.json({
      success: true,
      message: "Firebase integration saved.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to save Firebase integration.",
    });
  }
});

app.post("/api/integration/supabase", async (req, res) => {
  try {
    const { url, publishableKey } = req.body;

    if (!url || !publishableKey) {
      return res.status(400).json({
        message: "Supabase URL and publishable key are required.",
      });
    }

    await saveSupabase({
      url,
      publishableKey,
    });

    res.json({
      success: true,
      message: "Supabase integration saved.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to save Supabase integration.",
    });
  }
});

app.post("/api/integration/active", async (req, res) => {
  try {
    const { backend } = req.body;

    if (backend !== "firebase" && backend !== "supabase") {
      return res.status(400).json({
        message: "Invalid backend.",
      });
    }

    await setActiveBackend(backend);

    res.json({
      success: true,
      activeBackend: backend,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Unable to activate backend.",
    });
  }
});

app.delete("/api/integration/:backend", async (req, res) => {
  try {
    const backend = req.params.backend;

    if (backend !== "firebase" && backend !== "supabase") {
      return res.status(400).json({
        message: "Invalid backend.",
      });
    }

    const store = await getIntegration();

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
      store.activeBackend = null;
    }

    await import("./integrationStore").then(async (module) => {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");

      const dataDirectory = path.join(process.cwd(), "data");

      const filePath = path.join(dataDirectory, "integration.json");

      await fs.writeFile(filePath, JSON.stringify(store, null, 2));
    });

    res.json({
      success: true,
      message: `${backend} integration removed.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to remove integration.",
    });
  }
});

app.post("/api/integration/firebase/test", async (req, res) => {
  try {
    const {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    } = req.body;

    if (
      !apiKey ||
      !authDomain ||
      !projectId ||
      !storageBucket ||
      !messagingSenderId ||
      !appId
    ) {
      return res.status(400).json({
        message: "Firebase configuration is incomplete.",
      });
    }

    res.json({
      success: true,
      message: "Firebase configuration is valid.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to test Firebase connection.",
    });
  }
});

app.post("/api/integration/supabase/test", async (req, res) => {
  try {
    const { url, publishableKey } = req.body;

    if (!url || !publishableKey) {
      return res.status(400).json({
        message: "Supabase configuration is incomplete.",
      });
    }

    res.json({
      success: true,
      message: "Supabase configuration is valid.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to test Supabase connection.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
