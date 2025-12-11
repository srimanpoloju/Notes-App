import fs from "fs";
import path from "path";
import prisma from "../src/prismaClient";

async function run() {
  const dataFile = path.join(__dirname, "..", "data", "notes.json");
  if (!fs.existsSync(dataFile)) {
    console.log("No notes.json to seed from, exiting.");
    return;
  }
  const raw = fs.readFileSync(dataFile, "utf-8");
  const notes = JSON.parse(raw) as Array<any>;
  for (const n of notes) {
    try {
      // upsert based on id
      await prisma.note.upsert({
        where: { id: n.id },
        create: {
          id: n.id,
          title: n.title,
          content: n.content || "",
          createdAt: new Date(n.createdAt || Date.now()),
          updatedAt: n.updatedAt ? new Date(n.updatedAt) : undefined,
        },
        update: {
          title: n.title,
          content: n.content || "",
          updatedAt: n.updatedAt ? new Date(n.updatedAt) : new Date(),
        },
      });
    } catch (err) {
      console.error("Failed to upsert note", n.id, err);
    }
  }
  console.log("Seed complete");
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
