module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "closePool",
    ()=>closePool,
    "default",
    ()=>__TURBOPACK__default__export__,
    "execute",
    ()=>execute,
    "getPool",
    ()=>getPool,
    "query",
    ()=>query
]);
/*
 * MySQL connection pool using mysql2/promise.
 * Supports DATABASE_URL or individual DB_* environment variables.
 * This module provides a reusable connection pool for raw SQL queries.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
let pool = null;
/**
 * Parse DATABASE_URL format: mysql://user:password@host:port/database
 * Returns connection config object.
 */ function parseDatabaseUrl(url) {
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
            database: urlObj.pathname.slice(1)
        };
    } catch  {
        throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database');
    }
}
function getPool() {
    if (pool) {
        return pool;
    }
    let config;
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
            database: process.env.DB_NAME || process.env.DB_DATABASE || 'test'
        };
    }
    // Add connection pool settings
    pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
        ...config,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // Enable multiple statements for future use if needed
        multipleStatements: false
    });
    return pool;
}
async function query(sql, params) {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
}
async function execute(sql, params) {
    const pool = getPool();
    const [result] = await pool.execute(sql, params);
    return result;
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
const dbExports = {
    getPool,
    query,
    execute,
    closePool
};
const __TURBOPACK__default__export__ = dbExports;
}),
"[project]/app/api/trainingprograms/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
/*
Example Next.js App Router API route for training programs.
- GET: lists trainingprogram rows ordered by program_id and includes enrollments (programenrollment relation).
- POST: accepts JSON body and creates a trainingprogram. Validates presence of program_name.

Notes:
- This route uses raw SQL queries via mysql2/promise connection pool
- Enrollments are fetched using a JOIN query for efficiency
*/ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        // Fetch all training programs with their enrollments using a LEFT JOIN
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`SELECT 
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
      ORDER BY tp.program_id ASC`);
        // Group rows by program_id and aggregate enrollments
        const programsMap = new Map();
        for (const row of rows){
            if (!programsMap.has(row.program_id)) {
                programsMap.set(row.program_id, {
                    program_id: row.program_id,
                    program_name: row.program_name,
                    difficulty_level: row.difficulty_level,
                    goal: row.goal,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    created_by_trainer: row.created_by_trainer,
                    programenrollment: []
                });
            }
            const program = programsMap.get(row.program_id);
            // Add enrollment if it exists (LEFT JOIN may produce null values)
            if (row.enrollment_athlete_id !== null) {
                program.programenrollment.push({
                    athlete_id: row.enrollment_athlete_id,
                    program_id: row.enrollment_program_id,
                    enrollment_date: row.enrollment_date,
                    completion_status: row.completion_status
                });
            }
        }
        const enrichedPrograms = Array.from(programsMap.values());
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(enrichedPrograms);
    } catch (error) {
        // Log the error server-side for debugging
        console.error('GET /api/trainingprograms error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch training programs'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        if (!body || !body.program_name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'program_name is required'
            }, {
                status: 400
            });
        }
        const program_name = String(body.program_name);
        const difficulty_level = body.difficulty_level ?? null;
        const goal = body.goal ?? null;
        // Accept ISO date strings for start/end dates; convert when provided
        const start_date = body.start_date ? new Date(body.start_date) : null;
        const end_date = body.end_date ? new Date(body.end_date) : null;
        const created_by_trainer = body.created_by_trainer ?? null;
        // Insert the new training program
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["execute"])(`INSERT INTO trainingprogram 
       (program_name, difficulty_level, goal, start_date, end_date, created_by_trainer) 
       VALUES (?, ?, ?, ?, ?, ?)`, [
            program_name,
            difficulty_level,
            goal,
            start_date,
            end_date,
            created_by_trainer
        ]);
        // Fetch the created record to return it (mimicking Prisma's behavior)
        const insertId = result.insertId;
        const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM trainingprogram WHERE program_id = ?', [
            insertId
        ]);
        if (created.length === 0) {
            throw new Error('Failed to retrieve created training program');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(created[0], {
            status: 201
        });
    } catch (error) {
        console.error('POST /api/trainingprograms error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create training program'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__af8d54dc._.js.map