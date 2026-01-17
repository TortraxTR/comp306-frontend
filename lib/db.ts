/*
 * MySQL connection pool using mysql2/promise.
 * Supports DATABASE_URL or individual DB_* environment variables.
 * This module provides a reusable connection pool for raw SQL queries.
 */
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

/**
 * Parse DATABASE_URL format: mysql://user:password@host:port/database
 * Returns connection config object.
 */
function parseDatabaseUrl(url: string) {
  const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database');
  }
  
  const [, user, password, host, port, database] = match;
  return {
    host,
    port: parseInt(port, 10),
    user,
    password,
    database,
  };
}

/**
 * Get or create the MySQL connection pool.
 * Supports both DATABASE_URL and individual DB_* environment variables.
 */
export function getPool(): mysql.Pool {
  if (pool) {
    return pool;
  }

  let config: mysql.PoolOptions;

  if (process.env.DATABASE_URL) {
    // Parse DATABASE_URL
    config = parseDatabaseUrl(process.env.DATABASE_URL);
  } else {
    // Use individual DB_* variables
    config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || process.env.DB_DATABASE || 'test',
    };
  }

  // Add connection pool settings
  pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Enable multiple statements for future use if needed
    multipleStatements: false,
  });

  return pool;
}

interface QueryResult {
  insertId?: number;
}

/**
 * Execute a query with parameters.
 * Returns rows and fields from the query result.
 */
export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[] | QueryResult> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[] | QueryResult;
}

/**
 * Close the connection pool.
 * Useful for cleanup in tests or graceful shutdown.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

const dbExports = { getPool, query, closePool };
export default dbExports;
