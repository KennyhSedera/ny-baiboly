import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function openAndInit(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync('baiboly.db');

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uri TEXT,
      image_index INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bg TEXT,
      text TEXT,
      borderColor TEXT,
      colorIndex INTEGER
    );

    CREATE TABLE IF NOT EXISTS archives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_number INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      verses TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_number INTEGER,
      chapter INTEGER,
      verse TEXT,
      text TEXT,
      title TEXT,
      content TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_number INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      verse TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_number INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      verse TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settingRead (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fontSize INTEGER NOT NULL,
      textAlign TEXT NOT NULL,
      titeFormat TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS langues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appLng TEXT NOT NULL,
      bibleLng TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  return database;
}

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  if (!dbPromise) {
    dbPromise = openAndInit()
      .then((database) => {
        db = database;
        return database;
      })
      .catch((err) => {
        dbPromise = null;
        throw err;
      });
  }

  return dbPromise;
}