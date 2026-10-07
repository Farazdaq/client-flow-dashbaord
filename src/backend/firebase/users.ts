import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import type { Firestore } from "firebase/firestore";

import type { User } from "../types.ts";

export function createFirebaseUsers(db: Firestore) {
  const usersCollection = collection(db, "users");

  return {
    async list(): Promise<User[]> {
      const snapshot = await getDocs(usersCollection);

      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as User[];
    },

    async get(id: string): Promise<User | null> {
      const snapshot = await getDoc(doc(db, "users", id));

      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as User;
    },

    async create(user: Omit<User, "id">): Promise<User> {
      const ref = await addDoc(usersCollection, user);

      return {
        id: ref.id,
        ...user,
      };
    },

    async update(id: string, data: Partial<User>): Promise<User> {
      await updateDoc(doc(db, "users", id), data);

      const updated = await getDoc(doc(db, "users", id));

      return {
        id: updated.id,
        ...updated.data(),
      } as User;
    },

    async delete(id: string): Promise<void> {
      await deleteDoc(doc(db, "users", id));
    },
  };
}
