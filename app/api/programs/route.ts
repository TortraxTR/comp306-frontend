import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function GET() {
  try {
    // Adjust columns/table name to match your schema if different
    const rows = await query(
      `SELECT id, name, level, start_date, end_date, description
       FROM programs
       ORDER BY start_date DESC
       LIMIT 200`
    );
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: 'DB error', details: String(err) }, { status: 500 });
  }
}