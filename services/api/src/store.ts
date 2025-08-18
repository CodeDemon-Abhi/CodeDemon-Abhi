import fs from 'fs';
import path from 'path';
import { DataStoreShape, HabitEntry, ReportRecord, UserRecord } from './types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDb(): DataStoreShape {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    const initial: DataStoreShape = { users: [], habitsByUserId: {}, reportsByUserId: {} };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DataStoreShape;
}

function saveDb(db: DataStoreShape): void {
  ensureDataDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export const store = {
  upsertUser(userId: string): UserRecord {
    const db = loadDb();
    let user = db.users.find(u => u.userId === userId);
    if (!user) {
      user = { userId, createdAtIso: new Date().toISOString() };
      db.users.push(user);
      saveDb(db);
    }
    return user;
  },
  addReport(report: ReportRecord): void {
    const db = loadDb();
    if (!db.reportsByUserId[report.userId]) db.reportsByUserId[report.userId] = [];
    db.reportsByUserId[report.userId].push(report);
    saveDb(db);
  },
  getLatestReport(userId: string): ReportRecord | undefined {
    const db = loadDb();
    const list = db.reportsByUserId[userId] || [];
    return list[list.length - 1];
  },
  getReports(userId: string, limit = 10): ReportRecord[] {
    const db = loadDb();
    const list = db.reportsByUserId[userId] || [];
    return list.slice(-limit);
  },
  upsertHabit(userId: string, entry: HabitEntry): HabitEntry {
    const db = loadDb();
    if (!db.habitsByUserId[userId]) db.habitsByUserId[userId] = [];
    const existingIdx = db.habitsByUserId[userId].findIndex(h => h.dateIso === entry.dateIso);
    if (existingIdx >= 0) db.habitsByUserId[userId][existingIdx] = { ...db.habitsByUserId[userId][existingIdx], ...entry };
    else db.habitsByUserId[userId].push(entry);
    saveDb(db);
    return entry;
  },
  getHabits(userId: string): HabitEntry[] {
    const db = loadDb();
    return db.habitsByUserId[userId] || [];
  },
};

