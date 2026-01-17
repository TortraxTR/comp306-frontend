/*
Example Next.js App Router API route for training programs.
- GET: lists trainingprogram rows ordered by program_id and includes enrollments (programenrollment relation).
- POST: accepts JSON body and creates a trainingprogram. Validates presence of program_name.

Notes:
- This route uses raw SQL queries via mysql2/promise connection pool
- Enrollments are fetched using a JOIN query for efficiency
*/

import { NextResponse } from 'next/server';
import { query, execute } from '../../../lib/db';

// Types matching the database schema
interface TrainingProgram {
  program_id: number;
  program_name: string;
  difficulty_level: string | null;
  goal: string | null;
  start_date: Date | null;
  end_date: Date | null;
  created_by_trainer: number | null;
  programenrollment?: ProgramEnrollment[];
}

interface ProgramEnrollment {
  athlete_id: number;
  program_id: number;
  enrollment_date: Date | null;
  completion_status: string | null;
}

interface ProgramWithEnrollmentRow {
  program_id: number;
  program_name: string;
  difficulty_level: string | null;
  goal: string | null;
  start_date: Date | null;
  end_date: Date | null;
  created_by_trainer: number | null;
  enrollment_athlete_id: number | null;
  enrollment_program_id: number | null;
  enrollment_date: Date | null;
  completion_status: string | null;
}

// GET /api/trainingprograms
export async function GET() {
  try {
    // Fetch all training programs with their enrollments using a LEFT JOIN
    const rows = await query<ProgramWithEnrollmentRow>(
      `SELECT 
        tp.program_id,
        tp.program_name,
        tp.difficulty_level,
        tp.goal,
        tp.start_date,
        tp.end_date,
        tp.created_by_trainer,
        pe.athlete_id as enrollment_athlete_id,
        pe.program_id as enrollment_program_id,
        pe.enrollment_date,
        pe.completion_status
      FROM trainingprogram tp
      LEFT JOIN programenrollment pe ON tp.program_id = pe.program_id
      ORDER BY tp.program_id ASC`
    );

    // Group rows by program_id and aggregate enrollments
    const programsMap = new Map<number, TrainingProgram>();
    
    for (const row of rows) {
      if (!programsMap.has(row.program_id)) {
        programsMap.set(row.program_id, {
          program_id: row.program_id,
          program_name: row.program_name,
          difficulty_level: row.difficulty_level,
          goal: row.goal,
          start_date: row.start_date,
          end_date: row.end_date,
          created_by_trainer: row.created_by_trainer,
          programenrollment: [],
        });
      }
      
      const program = programsMap.get(row.program_id)!;
      
      // Add enrollment if it exists (LEFT JOIN may produce null values)
      if (row.enrollment_athlete_id !== null) {
        program.programenrollment!.push({
          athlete_id: row.enrollment_athlete_id,
          program_id: row.enrollment_program_id!,
          enrollment_date: row.enrollment_date,
          completion_status: row.completion_status,
        });
      }
    }

    const enrichedPrograms = Array.from(programsMap.values());
    return NextResponse.json(enrichedPrograms);
  } catch (error) {
    // Log the error server-side for debugging
    console.error('GET /api/trainingprograms error:', error);
    return NextResponse.json({ error: 'Failed to fetch training programs' }, { status: 500 });
  }
}

// POST /api/trainingprograms
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.program_name) {
      return NextResponse.json({ error: 'program_name is required' }, { status: 400 });
    }

    const program_name = String(body.program_name);
    const difficulty_level = body.difficulty_level ?? null;
    const goal = body.goal ?? null;
    // Accept ISO date strings for start/end dates; convert when provided
    const start_date = body.start_date ? new Date(body.start_date) : null;
    const end_date = body.end_date ? new Date(body.end_date) : null;
    const created_by_trainer = body.created_by_trainer ?? null;

    // Insert the new training program
    const result = await execute(
      `INSERT INTO trainingprogram 
       (program_name, difficulty_level, goal, start_date, end_date, created_by_trainer) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [program_name, difficulty_level, goal, start_date, end_date, created_by_trainer]
    );

    // Fetch the created record to return it (mimicking Prisma's behavior)
    const insertId = result.insertId;
    const created = await query<TrainingProgram>(
      'SELECT * FROM trainingprogram WHERE program_id = ?',
      [insertId]
    );

    if (created.length === 0) {
      throw new Error('Failed to retrieve created training program');
    }

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/trainingprograms error:', error);
    return NextResponse.json({ error: 'Failed to create training program' }, { status: 500 });
  }
}
