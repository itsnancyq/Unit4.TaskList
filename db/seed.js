import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seedUsers();
await seedTasks();
await db.end();
console.log("🌱 Database seeded.");

async function seedUsers() {
  await createUser({username: "bobbelcher", password: "burger"})
}

async function seedTasks() {
  await createTask({title: "clean grill", done: "false", user_id: "1"})
  await createTask({title: "wash dishes", done: "false", user_id: "1"})
  await createTask({title: "prep beef", done: "false", user_id: "1"})
}