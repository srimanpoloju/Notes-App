import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  addNote,
  getAllNotes,
  getNoteById,
  removeNote,
  updateNote,
  Note,
} from "../storage";

const router = Router();

router.get("/", async (_req, res) => {
  const notes = await getAllNotes();
  res.json(notes);
});

router.get("/:id", async (req, res) => {
  const note = await getNoteById(req.params.id);
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  const note: Note = {
    id: uuidv4(),
    title: title.trim(),
    content: content ? String(content) : "",
    createdAt: new Date().toISOString(),
  };
  const created = await addNote(note);
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const { title, content } = req.body;
  const updated = await updateNote(req.params.id, { title, content });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const ok = await removeNote(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).send();
});

export default router;
