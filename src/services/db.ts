import { Database } from "bun:sqlite";

const db = new Database("cf-manager.sqlite");

// 初始化表
db.run(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT,
    action TEXT,
    status TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const ConfigService = {
  get: (key: string): string | null => {
    const result = db.query("SELECT value FROM settings WHERE key = $key").get({ $key: key }) as { value: string } | null;
    return result?.value ?? null;
  },
  set: (key: string, value: string) => {
    db.run(
      `INSERT INTO settings (key, value) VALUES ($key, $value)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      { $key: key, $value: value }
    );
  },
  getAll: () => {
    return db.query("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  }
};

export const LogService = {
  add: (domain: string, action: string, status: string, message: string) => {
    db.run(
      `INSERT INTO logs (domain, action, status, message) VALUES ($domain, $action, $status, $message)`,
      { $domain: domain, $action: action, $status: status, $message: message }
    );
  },
  getRecent: (limit = 50) => {
    return db.query("SELECT * FROM logs ORDER BY created_at DESC LIMIT $limit").all({ $limit: limit }) as {
      id: number;
      domain: string;
      action: string;
      status: string;
      message: string;
      created_at: string;
    }[];
  },
  clear: () => {
    db.run("DELETE FROM logs");
  }
};
