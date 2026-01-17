/*
Example Next.js App Router API route for training programs.
- GET: lists trainingprogram rows ordered by program_id and includes enrollments (programenrollment relation).
- POST: accepts JSON body and creates a trainingprogram. Validates presence of program_name.

Notes:
- This route uses raw SQL queries via mysql2/promise connection pool
- Enrollments are fetched separately and joined in memory to match Prisma's include behavior
*/

import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

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

// GET /api/trainingprograms
export async function GET() {
  try {
    // Fetch all training programs ordered by program_id
    const programs = await query<TrainingProgram>(
      'SELECT * FROM trainingprogram ORDER BY program_id ASC'
    );

    // Fetch all program enrollments for enrichment
    const enrollments = await query<ProgramEnrollment>(
      'SELECT * FROM programenrollment'
    );

    // Group enrollments by program_id
    const enrollmentsByProgram = new Map<number, ProgramEnrollment[]>();
    for (const enrollment of enrollments) {
      const programEnrollments = enrollmentsByProgram.get(enrollment.program_id) || [];
      programEnrollments.push(enrollment);
      enrollmentsByProgram.set(enrollment.program_id, programEnrollments);
    }

    // Enrich programs with their enrollments
    const enrichedPrograms = programs.map(program => ({
      ...program,
      programenrollment: enrollmentsByProgram.get(program.program_id) || [],
    }));

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
    const result = await query<any>(
      `INSERT INTO trainingprogram 
       (program_name, difficulty_level, goal, start_date, end_date, created_by_trainer) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [program_name, difficulty_level, goal, start_date, end_date, created_by_trainer]
    );

    // Fetch the created record to return it (mimicking Prisma's behavior)
    const insertId = (result as any).insertId;
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
