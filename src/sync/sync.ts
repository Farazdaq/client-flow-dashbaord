import type { Backend } from "../backend/types.ts";

export async function syncUsers(source: Backend, target: Backend) {
  const sourceUsers = await source.users.list();

  for (const user of sourceUsers) {
    const existing = await target.users.get(user.id);

    if (!existing) {
      await target.users.create({
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      await target.users.update(user.id, {
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      });
    }
  }
}
