import { getDB } from "./database";

export interface NoteVerse {
  id?: number, note_id?: number, book_number: number, chapter: number, verse?: string, created_at?: string
}
export async function createNoteVerse({ book_number, chapter, verse, note_id }: NoteVerse) {
  const db = await getDB();
  const query = `INSERT INTO note_verse (note_id, book_number, chapter, verse, created_at) VALUES (?,?,?,?,?)`;

  try {
    const result = await db.runAsync(
      query,
      note_id || null, book_number, chapter, verse || null, new Date().toISOString()
    );
    return result.lastInsertRowId;

  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function getAllNoteVerseByNote(noteId: number): Promise<NoteVerse[]> {
  const db = await getDB();

  try {
    const query = `SELECT * FROM note_verse WHERE note_id=? ORDER BY created_at DESC`
    return await db.getAllAsync<NoteVerse>(query, noteId);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateNoteVerse(id: number) {
  const db = await getDB();
  try {
    await db.runAsync(`UPDATE note_verse SET created_at=? WHERE id=?`, new Date().toISOString(), id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function removeNoteVerse(id: number) {
  const db = await getDB();
  try {
    await db.runAsync(`DELETE FROM note_verse WHERE id=?`, id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}