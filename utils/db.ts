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
  `);
} catch (error) {
  console.error('Database initialization error:', error);
  db = new Database(':memory:');
}

export { db };