import * as SQLite from 'expo-sqlite';
import { migrations } from './migrations';

export interface DBClient {
  run(sql: string, params?: SQLite.SQLiteBindParams): Promise<void>;
  first<T>(sql: string, params?: SQLite.SQLiteBindParams): Promise<T | null>;
  all<T>(sql: string, params?: SQLite.SQLiteBindParams): Promise<T[]>;
}

class SQLiteClient implements DBClient {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async run(sql: string, params: SQLite.SQLiteBindParams = []): Promise<void> {
    await this.db.runAsync(sql, params);
  }

  async first<T>(sql: string, params: SQLite.SQLiteBindParams = []): Promise<T | null> {
    const row = await this.db.getFirstAsync<T>(sql, params);
    return row ?? null;
  }

  async all<T>(sql: string, params: SQLite.SQLiteBindParams = []): Promise<T[]> {
    return this.db.getAllAsync<T>(sql, params);
  }
}

let clientPromise: Promise<DBClient> | null = null;

export const getDbClient = async (): Promise<DBClient> => {
  if (!clientPromise) {
    clientPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('laptop_harbour.db');
      await db.execAsync('PRAGMA foreign_keys = ON;');
      for (const migration of migrations) {
        await db.execAsync(migration);
      }
      return new SQLiteClient(db);
    })();
  }

  return clientPromise;
};
