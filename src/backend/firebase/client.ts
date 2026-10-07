import { initializeApp, type FirebaseApp } from "firebase/app";

import { getFirestore, type Firestore } from "firebase/firestore";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function createFirebaseClient(config: FirebaseConfig): {
  app: FirebaseApp;
  db: Firestore;
} {
  const app = initializeApp(config);

  const db = getFirestore(app);

  return {
    app,
    db,
  };
}
