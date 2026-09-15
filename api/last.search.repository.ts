import { getDB } from "./database";

export interface LastSearch {
  id?: number, book_number: number, chapter: number, verse?: number, text?: string, search_at?: string
}
export async function createLastSearch(
  { book_number, chapter, verse, text }: LastSearch
) {
  const db = await getDB();

  const result = await db.runAsync(
    `INSERT INTO last_search (book_number, chapter, verse, text, search_at) VALUES (?,?,?,?,?)`,
    book_number, chapter, verse ?? null, text ?? null, new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export async function getAllLastSearch() {
  const db = await getDB();
  return await db.getAllAsync<LastSearch>(`SELECT * FROM last_search ORDER BY search_at DESC`);
}

export async function updateLastSearch(id: number) {
  const db = await getDB();

  try {
    await db.runAsync(`UPDATE last_search SET search_at=? WHERE id=?`, new Date().toISOString(), id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }

}

export async function removeLastSearch(id: number) {
  const db = await getDB();

  try {
    await db.runAsync(`DELETE FROM last_search WHERE id=?`, id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}