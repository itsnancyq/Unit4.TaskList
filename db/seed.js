import db from "#db/client";
import bcrypt from "bcrypt";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seedUsers("burger")
await seedTasks();
await db.end();
console.log("🌱 Database seeded.");

async function seedUsers(pw) {
  const hashPw = await bcrypt.hash(pw, 5)
  await createUser({username: "bobbelcher", password: hashPw})
}

async function seedTasks() {
  await createTask({title: "clean grill", done: "false", user_id: 1})
  await createTask({title: "wash dishes", done: "false", user_id: 1})
  await createTask({title: "prep beef", done: "false", user_id: 1})
}