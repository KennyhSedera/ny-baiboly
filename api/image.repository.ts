import { getDB } from './database';

export interface ImageRecord {
  id: number;
  uri?: string | null;
  image_index?: number | null;
  created_at: string;
}

// CREATE
export async function createImage(
  uri?: string,
  imageIndex?: number
): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO images (
      uri,
      image_index,
      created_at
    )
    VALUES (?, ?, ?)
    `,
    uri ?? null,
    imageIndex ?? null,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

// READ ALL
export async function getImages(): Promise<ImageRecord[]> {
  const db = await getDB();
  return await db.getAllAsync<ImageRecord>(
    `
    SELECT *
    FROM images
    ORDER BY created_at DESC
    `
  );
}

// READ BY ID
export async function getImageById(
  id: number
): Promise<ImageRecord | null> {
  const db = await getDB();
  return await db.getFirstAsync<ImageRecord>(
    `
    SELECT *
    FROM images
    WHERE id = ?
    `,
    id
  );
}

// UPDATE
export async function updateImage(
  id: number,
  uri?: string,
  imageIndex?: number
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    UPDATE images
    SET
      uri = ?,
      image_index = ?
    WHERE id = ?
    `,
    uri ?? null,
    imageIndex ?? null,
    id
  );
}

// DELETE
export async function deleteImage(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM images
    WHERE id = ?
    `,
    id
  );
}

// DELETE ALL
export async function deleteAllImages(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM images');
}