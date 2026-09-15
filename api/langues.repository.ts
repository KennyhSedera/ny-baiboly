import { getDB } from "./database";

export type LangType = 'mg' | 'fr' | 'en';

export interface LangueType {
  id: number;
  appLng: LangType;
  bibleLng: LangType;
  created_at: string;
}

export interface CreateLangueType {
  appLng: LangType;
  bibleLng: LangType;
  created_at?: string;
}

export interface UpdateLangueType {
  id: number;
  appLng: LangType;
  bibleLng: LangType;
}

export async function createLangue(params: CreateLangueType) {
  const db = await getDB();

  const result = await db.runAsync(
    `
      INSERT INTO langues (
        appLng,
        bibleLng,
        created_at
      )
      VALUES (?, ?, ?)
    `,
    params.appLng,
    params.bibleLng,
    new Date().toISOString()
  );

  return result.lastInsertRowId;
}

export async function getLangues(): Promise<LangueType[]> {
  const db = await getDB();
  return await db.getAllAsync<LangueType>(` SELECT * FROM langues `);
}

export async function updateLangue(params: UpdateLangueType) {
  const db = await getDB();
  const result = await db.runAsync(
    `
  UPDATE langues 
  SET 
  appLng = ?,
  bibleLng = ?,
  created_at = ?
  WHERE id = ?
  `,
    params.appLng,
    params.bibleLng,
    new Date().toISOString(),
    params.id
  )
  return result.lastInsertRowId;
}

export async function deleteLangue(id: number) {
  const db = await getDB();
  await db.runAsync(
    `
      DELETE FROM langues
      WHERE id = ?
      `,
    id
  );
}

export async function getLangueById(id: number): Promise<LangueType> {
  const db = await getDB();
  const result = await db.getFirstAsync<LangueType>(`SELECT * FROM langues WHERE id=?`, id);
  return result as LangueType;
} 