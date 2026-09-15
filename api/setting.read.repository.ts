import { getDB } from "./database";

export interface Setting {
  id: number,
  fontSize: number,
  textAlign: "left" | "center" | "right" | "justify" | "auto",
  titeFormat: "row" | "col",
  created_at: string
}

export interface SettingCreateProps {
  fontSize: number,
  textAlign: "left" | "center" | "right" | "justify" | "auto",
  titeFormat: "row" | "col",
}

export interface SettngUpdateProps {
  id: number,
  data: {
    fontSize: number,
    textAlign: "left" | "center" | "right" | "justify" | "auto",
    titeFormat: "row" | "col",
  }
}

export const createSetting = async (data: SettingCreateProps) => {
  const db = await getDB();
  const result = await db.runAsync(
    `
      INSERT INTO settingRead (
        fontSize,
        textAlign,
        titeFormat,
        created_at
      )
      VALUES (?, ?, ?, ?)
      `,
    data.fontSize,
    data.textAlign,
    data.titeFormat,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export const getSetting = async (): Promise<Setting[]> => {
  const db = await getDB();
  return await db.getAllAsync<Setting>(` SELECT * FROM settingRead `);
}

export const updateSetting = async (data: SettngUpdateProps) => {
  const db = await getDB();
  await db.runAsync(
    `
      UPDATE settingRead
      SET
        fontSize = ?,
        textAlign = ?,
        titeFormat = ?
      WHERE id = ?
      `,
    data.data.fontSize,
    data.data.textAlign,
    data.data.titeFormat,
    data.id
  );
}

export const deleteSetting = async (id: number) => {
  const db = await getDB();
  await db.runAsync(
    `
      DELETE FROM settingRead
      WHERE id = ?
      `,
    id
  );
}

export const getSettingById = async (id: number) => {
  const db = await getDB();
  return await db.getFirstAsync<Setting>(
    `
    SELECT *
    FROM settingRead
    WHERE id = ?
    `,
    id
  );
}