import { getDB } from './database';

export interface Favorite {
  id?: number;
  book_number: number;
  chapter: number;
  verse?: string;
  created_at?: string;
};

// CREATE
export async function createFavorite(data: Favorite): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO favorites (
      book_number,
      chapter,
      verse,
      created_at
    )
    VALUES (?, ?, ?, ?)
    `,
    data.book_number,
    data.chapter,
    data.verse ?? null,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

// READ ALL
export async function getFavorites(): Promise<Favorite[]> {
  const db = await getDB();
  return await db.getAllAsync<Favorite>(
    `
    SELECT *
    FROM favorites
    ORDER BY created_at DESC
    `
  );
}

// READ BY ID
export async function getFavoriteById(
  id: number
): Promise<Favorite | null> {
  const db = await getDB();
  return await db.getFirstAsync<Favorite>(
    `
    SELECT *
    FROM favorites
    WHERE id = ?
    `,
    id
  );
}

// READ PAR LIVRE + CHAPITRE
export async function getFavoriteByChapter(
  bookNumber: number,
  chapter: number
): Promise<Favorite[] | null> {
  const db = await getDB();
  return await db.getAllAsync<Favorite>(
    `
    SELECT *
    FROM favorites
    WHERE book_number = ?
      AND chapter = ?
    `,
    bookNumber,
    chapter
  );
}

// UPDATE
export async function updateFavorite(
  id: number,
  data: Favorite
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    UPDATE favorites
    SET
      book_number = ?,
      chapter = ?,
      verse = ?,
      created_at = ?
    WHERE id = ?
    `,
    data.book_number,
    data.chapter,
    data.verse ?? null,
    new Date().toISOString(),
    id
  );
}

// DELETE
export async function deleteFavorite(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM favorites
    WHERE id = ?
    `,
    id
  );
}

// DELETE ALL
export async function deleteAllFavorites(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM favorites');
}

// DELETE PAR LIVRE + CHAPITRE
export async function deleteFavoritesByChapter(
  bookNumber: number,
  chapter: number
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM favorites
    WHERE book_number = ?
      AND chapter = ?
    `,
    bookNumber,
    chapter
  );
}