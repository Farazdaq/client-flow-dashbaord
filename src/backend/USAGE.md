# ClientFlow Backend Integration Usage

ClientFlow supports multiple backend providers through a single application interface.

Currently supported:

- Firebase
- Supabase

The application pages should **never directly depend on Firebase or Supabase**.

Instead, pages use services such as:

```text
src/services/users.ts
src/services/orders.ts
src/services/integration.ts
```

The active backend is selected from the Integration settings.

---

# 1. Architecture

The application follows this flow:

```text
React Page
   │
   ▼
Service
   │
   ▼
Backend Manager
   │
   ├── Firebase Backend
   │
   └── Supabase Backend
```

For example:

```text
Orders.tsx
    │
    ▼
services/orders.ts
    │
    ▼
backend/manager.ts
    │
    ├── firebase/orders.ts
    │
    └── supabase/orders.ts
```

The `Orders.tsx` page does not need to know which provider is being used.

---

# 2. Integration Configuration

The administrator opens:

```text
Settings
   ↓
Integrations
```

The administrator can configure:

```text
Firebase
```

or:

```text
Supabase
```

The configuration is sent to the Express server.

```text
React
  ↓
POST /api/integration/firebase
```

or:

```text
React
  ↓
POST /api/integration/supabase
```

The server encrypts the configuration before saving it.

Example stored data:

```json
{
  "activeBackend": "supabase",
  "firebase": {
    "enabled": true,
    "connected": true,
    "config": "encrypted-value"
  },
  "supabase": {
    "enabled": true,
    "connected": true,
    "config": "encrypted-value"
  }
}
```

The encrypted configuration should never be returned to the React application.

---

# 3. Selecting the Active Backend

Only one backend is active at a time.

Example:

```text
Firebase      Connected
Supabase      Connected
                  ↑
                Active
```

The administrator can switch:

```text
Firebase → Supabase
```

or:

```text
Supabase → Firebase
```

The application functionality remains the same.

For example:

```text
Orders
Customers
Campaigns
Analytics
```

continue using the same React pages and services.

---

# 4. Using the Backend From a Page

Do not do this inside a page:

```tsx
import { getFirestore } from "firebase/firestore";
```

Do not do this:

```tsx
import { createClient } from "@supabase/supabase-js";
```

Pages should use application services instead.

Example:

```tsx
import { getOrders } from "../services/orders";
```

---

# 5. Orders Example

Create:

```text
src/services/orders.ts
```

The service provides the application-level API.

```ts
import { backendManager } from "../backend/manager";

export interface Order {
  id: string;
  customerId: string;
  total: number;
  status: string;
  createdAt: string;
}

export async function getOrders(): Promise<Order[]> {
  return backendManager.orders.getAll();
}

export async function getOrder(id: string): Promise<Order | null> {
  return backendManager.orders.getById(id);
}

export async function createOrder(order: Omit<Order, "id">): Promise<Order> {
  return backendManager.orders.create(order);
}

export async function updateOrder(
  id: string,
  data: Partial<Order>,
): Promise<Order> {
  return backendManager.orders.update(id, data);
}

export async function deleteOrder(id: string): Promise<void> {
  return backendManager.orders.delete(id);
}
```

The page only knows about `orders.ts`.

---

# 6. Backend Interface

Create a common interface for orders.

Example:

```text
src/backend/types.ts
```

```ts
export interface OrdersBackend {
  getAll(): Promise<Order[]>;

  getById(id: string): Promise<Order | null>;

  create(order: Omit<Order, "id">): Promise<Order>;

  update(id: string, data: Partial<Order>): Promise<Order>;

  delete(id: string): Promise<void>;
}

export interface Order {
  id: string;
  customerId: string;
  total: number;
  status: string;
  createdAt: string;
}
```

Both Firebase and Supabase must implement this interface.

---

# 7. Firebase Orders

Create:

```text
src/backend/firebase/orders.ts
```

Example:

```ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { firebaseDb } from "./client";

import type { Order, OrdersBackend } from "../types";

export const firebaseOrders: OrdersBackend = {
  async getAll() {
    const snapshot = await getDocs(collection(firebaseDb, "orders"));

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Order[];
  },

  async getById(id) {
    const snapshot = await getDoc(doc(firebaseDb, "orders", id));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Order;
  },

  async create(order) {
    const reference = await addDoc(collection(firebaseDb, "orders"), order);

    return {
      id: reference.id,
      ...order,
    };
  },

  async update(id, data) {
    await updateDoc(doc(firebaseDb, "orders", id), data);

    const updated = await getDoc(doc(firebaseDb, "orders", id));

    return {
      id: updated.id,
      ...updated.data(),
    } as Order;
  },

  async delete(id) {
    await deleteDoc(doc(firebaseDb, "orders", id));
  },
};
```

---

# 8. Supabase Orders

Create:

```text
src/backend/supabase/orders.ts
```

Example:

```ts
import { supabase } from "./client";

import type { Order, OrdersBackend } from "../types";

export const supabaseOrders: OrdersBackend = {
  async getAll() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      throw error;
    }

    return data as Order[];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }

      throw error;
    }

    return data as Order;
  },

  async create(order) {
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Order;
  },

  async update(id, changes) {
    const { data, error } = await supabase
      .from("orders")
      .update(changes)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Order;
  },

  async delete(id) {
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      throw error;
    }
  },
};
```

---

# 9. Backend Manager

The manager decides which implementation should be used.

Example:

```text
src/backend/manager.ts
```

```ts
import { firebaseOrders } from "./firebase/orders";
import { supabaseOrders } from "./supabase/orders";

import type { OrdersBackend } from "./types";

export type BackendType = "firebase" | "supabase";

async function getActiveBackend(): Promise<BackendType> {
  const response = await fetch("http://localhost:4000/api/integration");

  if (!response.ok) {
    throw new Error("Unable to load active backend.");
  }

  const integration = await response.json();

  if (!integration.activeBackend) {
    throw new Error("No backend is currently active.");
  }

  return integration.activeBackend;
}

export const backendManager = {
  orders: {
    async getBackend(): Promise<OrdersBackend> {
      const backend = await getActiveBackend();

      if (backend === "firebase") {
        return firebaseOrders;
      }

      return supabaseOrders;
    },

    async getAll() {
      const service = await this.getBackend();

      return service.getAll();
    },

    async getById(id: string) {
      const service = await this.getBackend();

      return service.getById(id);
    },

    async create(order: any) {
      const service = await this.getBackend();

      return service.create(order);
    },

    async update(id: string, data: any) {
      const service = await this.getBackend();

      return service.update(id, data);
    },

    async delete(id: string) {
      const service = await this.getBackend();

      return service.delete(id);
    },
  },
};
```

In a production application, the active backend selection should preferably happen on the server rather than exposing provider credentials to the browser.

---

# 10. Orders Page

The React page becomes simple.

```tsx
import { useEffect, useState } from "react";

import { getOrders, deleteOrder } from "../services/orders";

import type { Order } from "../backend/types";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const result = await getOrders();

      setOrders(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteOrder(id);

      await loadOrders();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete order.",
      );
    }
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Orders</h1>

      {orders.map((order) => (
        <div key={order.id}>
          <p>Order: {order.id}</p>

          <p>Total: ${order.total}</p>

          <p>Status: {order.status}</p>

          <button onClick={() => handleDelete(order.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

The important part is that this page never asks:

```text
Is Firebase active?
```

or:

```text
Is Supabase active?
```

The backend layer handles that.

---

# 11. Creating an Order

A page can create an order like this:

```tsx
import { createOrder } from "../services/orders";

async function handleCreate() {
  await createOrder({
    customerId: "customer-123",
    total: 150,
    status: "pending",
    createdAt: new Date().toISOString(),
  });
}
```

The same code works when:

```text
Firebase is active
```

and when:

```text
Supabase is active
```

---

# 12. Updating an Order

```ts
import { updateOrder } from "../services/orders";

await updateOrder(order.id, {
  status: "completed",
});
```

Firebase will perform a Firestore update.

Supabase will perform a PostgreSQL update.

The React page does not change.

---

# 13. Adding a New Feature

For a new feature such as:

```text
Products
```

create:

```text
src/
├── services/
│   └── products.ts
│
└── backend/
    ├── types.ts
    │
    ├── firebase/
    │   └── products.ts
    │
    └── supabase/
        └── products.ts
```

The structure becomes:

```text
Products.tsx
      │
      ▼
services/products.ts
      │
      ▼
backend/manager.ts
      │
      ├───────────────┐
      ▼               ▼
Firebase          Supabase
products          products
```

---

# 14. Adding Another Integration

Suppose a third backend called:

```text
Postgres
```

is added later.

Do not modify every page.

Add:

```text
src/backend/postgres/
├── client.ts
├── orders.ts
├── users.ts
└── products.ts
```

Then implement the same interfaces:

```ts
export const postgresOrders: OrdersBackend = {
  async getAll() {
    // PostgreSQL implementation
  },

  async getById(id) {
    // PostgreSQL implementation
  },

  async create(order) {
    // PostgreSQL implementation
  },

  async update(id, data) {
    // PostgreSQL implementation
  },

  async delete(id) {
    // PostgreSQL implementation
  },
};
```

Then add:

```ts
export type BackendType = "firebase" | "supabase" | "postgres";
```

And update the backend manager.

The existing pages remain unchanged.

---

# 15. Recommended Rule

Every application feature should follow:

```text
Page
 ↓
Service
 ↓
Backend Manager
 ↓
Provider Implementation
```

Never:

```text
Page
 ↓
Firebase
```

and never:

```text
Page
 ↓
Supabase
```

This keeps the application provider-independent.

---

# 16. Example Full Application Structure

```text
src/
│
├── app/
│   ├── App.tsx
│   └── router.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   │
│   └── integration/
│       ├── IntegrationPage.tsx
│       ├── FirebaseForm.tsx
│       ├── SupabaseForm.tsx
│       └── SyncPanel.tsx
│
├── backend/
│   ├── types.ts
│   ├── manager.ts
│   │
│   ├── firebase/
│   │   ├── client.ts
│   │   ├── users.ts
│   │   ├── orders.ts
│   │   └── products.ts
│   │
│   └── supabase/
│       ├── client.ts
│       ├── users.ts
│       ├── orders.ts
│       └── products.ts
│
├── services/
│   ├── integration.ts
│   ├── users.ts
│   ├── orders.ts
│   └── products.ts
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Orders.tsx
│   └── Products.tsx
│
└── main.tsx
```

Server:

```text
server/
├── index.ts
├── integrationStore.ts
└── syncWorker.ts
```

---

# 17. Important Security Rule

The integration configuration is stored on the server.

For example:

```text
data/integration.json
```

should contain encrypted configuration:

```json
{
  "firebase": {
    "config": "iv.authTag.encryptedData"
  },
  "supabase": {
    "config": "iv.authTag.encryptedData"
  }
}
```

Do not commit this file to Git.

Add:

```text
data/
.env
```

to `.gitignore`.

The encryption key must remain in the server environment:

```env
ENCRYPTION_KEY=your-64-character-hex-key
```

Never put:

```env
ENCRYPTION_KEY
```

inside the Vite frontend environment.

---

# 18. Switching Backend

When the administrator clicks:

```text
Make Active
```

the application calls:

```http
POST /api/integration/active
```

with:

```json
{
  "backend": "firebase"
}
```

or:

```json
{
  "backend": "supabase"
}
```

The server stores:

```json
{
  "activeBackend": "firebase"
}
```

After switching, the same:

```ts
getOrders();
```

call uses Firebase.

If switched to Supabase:

```ts
getOrders();
```

uses Supabase.

No page code changes are required.

---

# 19. Manual Synchronization

If both integrations are connected:

```text
Firebase
   Connected

Supabase
   Connected

Active:
Firebase
```

You can provide a synchronization action:

```text
Sync Firebase → Supabase
```

The sync service should be responsible for translating data between providers.

Example:

```text
Firebase orders
      ↓
sync/orders
      ↓
Supabase orders
```

The page should call:

```ts
await syncOrders();
```

rather than implementing synchronization itself.

---

# 20. Automatic Synchronization

The server can later run a worker:

```text
server/syncWorker.ts
```

For example:

```text
Every 5 minutes
      ↓
Check sync configuration
      ↓
Read active/source backend
      ↓
Read destination backend
      ↓
Compare records
      ↓
Create/update missing records
      ↓
Save lastSyncAt
```

The React application does not need to remain open for server-side synchronization.

---

# 21. Final Principle

The goal is:

```text
                 ┌── Firebase
                 │
React → Service → Manager
                 │
                 └── Supabase
```

Every page uses the same service regardless of the provider.

For example:

```ts
getUsers();
getOrders();
getProducts();
createOrder();
updateOrder();
deleteOrder();
```

The backend implementation can change underneath these functions without changing the dashboard UI.

That is what allows ClientFlow to support multiple integrations while keeping the same application functionality.
