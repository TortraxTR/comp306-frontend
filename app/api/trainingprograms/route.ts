/*
Example Next.js App Router API route for training programs.
- GET: lists trainingprogram rows ordered by program_id and includes enrollments (programenrollment relation).
- POST: accepts JSON body and creates a trainingprogram. Validates presence of program_name.

Notes:
- This route imports the server-only Prisma wrapper at ../../.. (project root lib/prisma)
- Adjust the import if you move files.
*/

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/trainingprograms
export async function GET() {
  try {
    const programs = await prisma.trainingprogram.findMany({
      orderBy: { program_id: 'asc' },
      include: { programenrollment: true },
    });

    return NextResponse.json(programs);
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

    const data = {
      program_name: String(body.program_name),
      difficulty_level: body.difficulty_level ?? null,
      goal: body.goal ?? null,
      // Accept ISO date strings for start/end dates; convert when provided
      start_date: body.start_date ? new Date(body.start_date) : null,
      end_date: body.end_date ? new Date(body.end_date) : null,
      created_by_trainer: body.created_by_trainer ?? null,
    };

    const created = await prisma.trainingprogram.create({ data });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /api/trainingprograms error:', error);
    return NextResponse.json({ error: 'Failed to create training program' }, { status: 500 });
  }
}
