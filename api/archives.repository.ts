import { getDB } from './database';

export interface Archive {
  id: number;
  book_number: number;
  chapter: number;
  verses: string | null;
  created_at: string;
}

// CREATE
export async function createArchive(data: {
  book_number: number;
  chapter: number;
  verses?: string;
}): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO archives (
      book_number,
      chapter,
      verses,
      created_at
    )
    VALUES (?, ?, ?, ?)
    `,
    data.book_number,
    data.chapter,
    data.verses ?? null,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

// READ ALL
export async function getArchives(): Promise<Archive[]> {
  const db = await getDB();
  return await db.getAllAsync<Archive>(
    `
    SELECT *
    FROM archives
    ORDER BY created_at DESC
    `
  );
}

// READ BY ID
export async function getArchiveById(
  id: number
): Promise<Archive | null> {
  const db = await getDB();
  return await db.getFirstAsync<Archive>(
    `
    SELECT *
    FROM archives
    WHERE id = ?
    `,
    id
  );
}

// READ PAR LIVRE + CHAPITRE
export async function getArchiveByChapter(
  bookNumber: number,
  chapter: number
): Promise<Archive | null> {
  const db = await getDB();
  return await db.getFirstAsync<Archive>(
    `
    SELECT *
    FROM archives
    WHERE book_number = ?
      AND chapter = ?
    `,
    bookNumber,
    chapter
  );
}

// UPDATE
export async function updateArchive(
  id: number,
  data: {
    book_number: number;
    chapter: number;
    verses?: string;
  }
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    UPDATE archives
    SET
      book_number = ?,
      chapter = ?,
      verses = ?
    WHERE id = ?
    `,
    data.book_number,
    data.chapter,
    data.verses ?? null,
    id
  );
}

// DELETE
export async function deleteArchive(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM archives
    WHERE id = ?
    `,
    id
  );
}

// DELETE ALL
export async function deleteAllArchives(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM archives');
}