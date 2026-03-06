import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calculation } from '../entities/Calculation';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/calculator.db';
const resolvedDbPath = path.resolve(process.cwd(), dbPath);
const dbDir = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let AppDataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedDbPath,
    entities: [Calculation],
    synchronize: true,
    logging: false,
  });

  await AppDataSource.initialize();
  return AppDataSource;
}
