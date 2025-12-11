import prisma from "./prismaClient";

export type Note = {
  id: string;
  title: string;
  content?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

export async function getAllNotes(): Promise<Note[]> {
  const rows = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    content: r.content ?? "",
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
  }));
}

export async function getNoteById(id: string): Promise<Note | null> {
  const r = await prisma.note.findUnique({ where: { id } });
  if (!r) return null;
  return {
    id: r.id,
    title: r.title,
    content: r.content ?? "",
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
  };
}

export async function addNote(note: Note): Promise<Note> {
  const r = await prisma.note.create({
    data: {
      id: note.id,
      title: note.title,
      content: note.content ?? "",
      createdAt: new Date(note.createdAt),
      updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
    },
  });
  return {
    id: r.id,
    title: r.title,
    content: r.content ?? "",
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
  };
}

export async function updateNote(id: string, patch: Partial<Note>): Promise<Note | null> {
  try {
    const r = await prisma.note.update({
      where: { id },
      data: {
        title: patch.title,
        content: patch.content,
        updatedAt: new Date(),
      },
    });
    return {
      id: r.id,
      title: r.title,
      content: r.content ?? "",
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt ? r.updatedAt.toISOString() : undefined,
    };
  } catch (err) {
    return null;
  }
}

export async function removeNote(id: string): Promise<boolean> {
  try {
    await prisma.note.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
}
