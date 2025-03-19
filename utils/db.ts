import Database from 'better-sqlite3';
import { join } from 'path';

let db: Database.Database;

try {
  db = new Database(join(process.cwd(), 'company.db'));

  // Initialize database with required tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS allowed_emails (
      id TEXT PRIMARY KEY,
      pattern TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    INSERT OR IGNORE INTO allowed_emails (id, pattern)
    VALUES ('default', '@aganitha\\.ai$');
  `);
} catch (error) {
  console.error('Database initialization error:', error);
  db = new Database(':memory:');
}

export { db };