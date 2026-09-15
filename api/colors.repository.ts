import { getDB } from "./database";


export interface Color {
  id: number;
  bg?: string;
  text?: string;
  borderColor?: string;
  colorIndex?: number;
}

export interface CreatColorProps {
  bg?: string;
  text?: string;
  borderColor?: string;
  colorIndex?: number;
}

export interface UpdateColorProps {
  bg?: string;
  text?: string;
  borderColor?: string;
  colorIndex?: number;
}

// CREATE
export async function createColor(data: CreatColorProps): Promise<number> {
  const db = await getDB();
  const result = await db.runAsync(
    `
    INSERT INTO colors (
      bg,
      text,
      borderColor,
      colorIndex
    )
    VALUES (?, ?, ?, ?)
    `,
    data.bg || null,
    data.text || null,
    data.borderColor || null,
    data.colorIndex ?? null
  );

  return result.lastInsertRowId;
}

// READ ALL
export async function getColors(): Promise<Color[]> {
  const db = await getDB();
  return await db.getAllAsync<Color>(
    `
    SELECT *
    FROM colors
    ORDER BY id DESC
    `
  );
}

// READ BY ID
export async function getColorById(
  id: number
): Promise<Color | null> {
  const db = await getDB();
  return await db.getFirstAsync<Color>(
    `
    SELECT *
    FROM colors
    WHERE id = ?
    `,
    id
  );
}

// UPDATE
export async function updateColor(
  id: number,
  data: UpdateColorProps
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    UPDATE colors
    SET
      bg = ?,
      text = ?,
      borderColor = ?,
      colorIndex = ?
    WHERE id = ?
    `,
    data.bg || null,
    data.text || null,
    data.borderColor || null,
    data.colorIndex ?? null,
    id
  );
}

// DELETE
export async function deleteColor(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `
    DELETE FROM colors
    WHERE id = ?
    `,
    id
  );
}

// DELETE ALL
export async function deleteAllColors(): Promise<void> {
  const db = await getDB();
  await db.runAsync('DELETE FROM colors');
}