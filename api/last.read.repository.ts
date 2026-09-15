import { getDB } from "./database";

export interface LastRead {
  id?: number, book_number: number, chapter: number, verse?: string, created_at?: string
}
export async function createLastRead(
  { book_number, chapter, verse }: LastRead
) {
  const db = await getDB();

  const result = await db.runAsync(
    `INSERT INTO last_read (book_number, chapter, verse, created_at) VALUES (?,?,?,?)`,
    book_number, chapter, verse ?? null, new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export async function getAllLastRead() {
  const db = await getDB();
  return await db.getAllAsync<LastRead>(`SELECT * FROM last_read ORDER BY created_at DESC`);
}

export async function removeLastRead(id: number) {
  const db = await getDB();

  try {
    await db.runAsync(`DELETE FROM last_read WHERE id=?`, id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }

}