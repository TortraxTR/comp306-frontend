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
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'mysql:') {
      throw new Error('URL must use mysql: protocol');
    }
    return {
      host: urlObj.hostname,
      port: urlObj.port ? parseInt(urlObj.port, 10) : 3306,
      user: decodeURIComponent(urlObj.username),
      password: decodeURIComponent(urlObj.password),
      database: urlObj.pathname.slice(1), // Remove leading slash
    };
  } catch {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database');
  }
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

/**
 * Execute a SELECT query with parameters.
 * Returns an array of rows.
 */
export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

/**
 * Execute an INSERT/UPDATE/DELETE query with parameters.
 * Returns the result metadata including insertId and affectedRows.
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<mysql.ResultSetHeader> {
  const pool = getPool();
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
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

const dbExports = { getPool, query, execute, closePool };
export default dbExports;
