import { getDB } from './database';

export interface Note {
  id?: number;
  title?: string | null;
  content?: string | null;
  created_at?: string;
}

// CREATE
export async function createNote(data: Note) {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO notes (
      title,
      content,
      created_at
    )
    VALUES (?, ?, ?)
    `,
    data.title ?? null,
    data.content ?? null,
    new Date().toISOString()
  );

  console.log("Créer avec succès.");


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
      title = ?,
      content = ?
    WHERE id = ?
    `,
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