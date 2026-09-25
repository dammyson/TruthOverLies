import {open, OPSQLiteConnection} from '@op-engineering/op-sqlite';

let _db: OPSQLiteConnection | null = null;

export function getDb(): OPSQLiteConnection {
  if (_db) {
    return _db;
  }

  _db = open({name: 'bible.db'});

  _db.execute('PRAGMA journal_mode = WAL');

  // Generic key-value cache for translation list, book lists, online chapters
  _db.execute(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      val TEXT NOT NULL,
      ts  TEXT NOT NULL
    )
  `);

  // Tracks which translations have been fully downloaded
  _db.execute(`
    CREATE TABLE IF NOT EXISTS translations (
      id            TEXT PRIMARY KEY,
      name          TEXT,
      downloaded_at TEXT,
      version       INTEGER DEFAULT 1
    )
  `);

  // All downloaded verse content
  _db.execute(`
    CREATE TABLE IF NOT EXISTS verses (
      translation TEXT    NOT NULL,
      book        TEXT    NOT NULL,
      chapter     INTEGER NOT NULL,
      verse       INTEGER NOT NULL,
      text        TEXT    NOT NULL,
      PRIMARY KEY (translation, book, chapter, verse)
    )
  `);

  _db.execute(`
    CREATE INDEX IF NOT EXISTS idx_verse_lookup
    ON verses (translation, book, chapter)
  `);

  // Chapter section headings (e.g. "Hannah's Prayer")
  _db.execute(`
    CREATE TABLE IF NOT EXISTS passage_titles (
      translation TEXT    NOT NULL,
      book        TEXT    NOT NULL,
      chapter     INTEGER NOT NULL,
      verse_start INTEGER NOT NULL,
      verse_end   INTEGER,
      title       TEXT    NOT NULL,
      PRIMARY KEY (translation, book, chapter, verse_start)
    )
  `);

  _db.execute(`
    CREATE INDEX IF NOT EXISTS idx_passage_title_lookup
    ON passage_titles (translation, book, chapter)
  `);

  return _db;
}
