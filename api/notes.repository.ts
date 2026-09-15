import { getDB } from './database';

export interface Note {
  id: number;
  book_number: number | null;
  chapter: number | null;
  verse: string | null;
  text: string | null;
  title: string | null;
  content: string | null;
  created_at: string;
}

// CREATE
export async function createNote(data: {
  book_number?: number | null;
  chapter?: number | null;
  verse?: number;
  text?: string | null;
  title?: string;
  content?: string;
}) {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO notes (
      book_number,
      chapter,
      verse,
      text,
      title,
      content,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    data.book_number ?? null,
    data.chapter ?? null,
    data.verse ?? null,
    data.text ?? null,
    data.title ?? null,
    data.content ?? null,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

// READ ALL
export async function getNotes(): Promise<Note[]> {
  const db = await getDB();
  return await db.getAllAsync<Note>(
    `
    SELECT *
    FROM notes
    ORDER BY created_at DESC
    `
  );
}

export async function getMaxId() {
  const db = await getDB();
  const result = await db.getAllAsync<{ maxId: number }>(
    `
    SELECT MAX(id) as maxId FROM notes
    `
  );
  return result[0].maxId;
}

// READ BY ID
export async function getNoteById(
  id: number
): Promise<Note | null> {
  const db = await getDB();
  return await db.getFirstAsync<Note>(
    `
    SELECT *
    FROM notes
    WHERE id = ?
    `,
    id
  );
}

// READ NOTES D'UN VERSET
export async function getNotesByVerse(
  bookNumber: number,
  chapter: number,
  verse: string
): Promise<Note[]> {
  const db = await getDB();
  return await db.getAllAsync<Note>(
    `
    SELECT *
    FROM notes
    WHERE id = ?
    ORDER BY created_at DESC
    `,
    bookNumber,
    chapter,
    verse
  );
}

// UPDATE
export async function updateNote(
  id: number,
  data: {
    text?: string;
    title?: string;
    content?: string;
  }
) {
  const db = await getDB();
  await db.runAsync(
    `
    UPDATE notes
    SET
      text = ?,
      title = ?,
      content = ?
    WHERE id = ?
    `,
    data.text ?? null,
    data.title ?? null,
    data.content ?? null,
    id
  );
}

// DELETE
export async function deleteNote(id: number) {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM notes
    WHERE id = ?
    `,
    id
  );
  return { success: true }
}