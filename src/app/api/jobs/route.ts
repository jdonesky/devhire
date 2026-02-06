import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, ExperienceLevel, EmploymentType } from "@prisma/client";

const JOBS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const experienceLevel = searchParams.get("experience") as ExperienceLevel | null;
  const employmentType = searchParams.get("type") as EmploymentType | null;
  const isRemote = searchParams.get("remote");
  const salaryMin = searchParams.get("salaryMin");
  const tech = searchParams.get("tech");
  const sortBy = searchParams.get("sort") ?? "newest";

  // ── Build WHERE clause ──────────────────────────────────────────
  const where: Prisma.JobWhereInput = {
    isActive: true,
  };

  if (experienceLevel && Object.values(ExperienceLevel).includes(experienceLevel)) {
    where.experienceLevel = experienceLevel;
  }

  if (employmentType && Object.values(EmploymentType).includes(employmentType)) {
    where.employmentType = employmentType;
  }

  if (isRemote === "true") {
    where.isRemote = true;
  }

  if (salaryMin) {
    const min = parseInt(salaryMin, 10);
    if (!isNaN(min)) {
      where.salaryMax = { gte: min };
    }
  }

  if (tech) {
    where.techStack = { has: tech };
  }

  // ── Full-text search via raw SQL ────────────────────────────────
  if (query.trim()) {
    const tsQuery = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `${word}:*`)
      .join(" & ");

    // Use raw query for full-text search with ranking
    const offset = (page - 1) * JOBS_PER_PAGE;

    // Build filter conditions for the raw query
    const conditions: string[] = ['"isActive" = true'];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    // Full-text search condition
    conditions.push(`"searchVector" @@ to_tsquery('english', $${paramIndex})`);
    params.push(tsQuery);
    paramIndex++;

    if (experienceLevel && Object.values(ExperienceLevel).includes(experienceLevel)) {
      conditions.push(`"experienceLevel"::text = $${paramIndex}`);
      params.push(experienceLevel);
      paramIndex++;
    }

    if (employmentType && Object.values(EmploymentType).includes(employmentType)) {
      conditions.push(`"employmentType"::text = $${paramIndex}`);
      params.push(employmentType);
      paramIndex++;
    }

    if (isRemote === "true") {
      conditions.push(`"isRemote" = true`);
    }

    if (salaryMin) {
      const min = parseInt(salaryMin, 10);
      if (!isNaN(min)) {
        conditions.push(`"salaryMax" >= $${paramIndex}`);
        params.push(min);
        paramIndex++;
      }
    }

    if (tech) {
      conditions.push(`$${paramIndex} = ANY("techStack")`);
      params.push(tech);
      paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    // Count query
    const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM "Job" WHERE ${whereClause}`,
      ...params
    );
    const total = Number(countResult[0].count);

    // Data query with ranking
    const orderClause =
      sortBy === "salary"
        ? `"salaryMax" DESC NULLS LAST`
        : sortBy === "oldest"
        ? `"createdAt" ASC`
        : `ts_rank("searchVector", to_tsquery('english', $${paramIndex})) DESC, "createdAt" DESC`;

    if (sortBy !== "salary" && sortBy !== "oldest") {
      params.push(tsQuery);
      paramIndex++;
    }

    const jobRows = await prisma.$queryRawUnsafe<
      Array<{ id: string }>
    >(
      `SELECT "id" FROM "Job" WHERE ${whereClause} ORDER BY ${orderClause} LIMIT ${JOBS_PER_PAGE} OFFSET ${offset}`,
      ...params
    );

    const jobIds = jobRows.map((r) => r.id);

    // Fetch full job objects with relations using Prisma
    const jobs =
      jobIds.length > 0
        ? await prisma.job.findMany({
            where: { id: { in: jobIds } },
            include: { company: { select: { id: true, name: true, logo: true } } },
          })
        : [];

    // Preserve the search ranking order
    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const orderedJobs = jobIds.map((id) => jobMap.get(id)).filter(Boolean);

    return NextResponse.json({
      jobs: orderedJobs,
      pagination: {
        page,
        perPage: JOBS_PER_PAGE,
        total,
        totalPages: Math.ceil(total / JOBS_PER_PAGE),
      },
    });
  }

  // ── Non-search query (browse mode) ─────────────────────────────
  const orderBy: Prisma.JobOrderByWithRelationInput =
    sortBy === "salary"
      ? { salaryMax: { sort: "desc", nulls: "last" } }
      : sortBy === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: { select: { id: true, name: true, logo: true } },
      },
      orderBy,
      skip: (page - 1) * JOBS_PER_PAGE,
      take: JOBS_PER_PAGE,
    }),
    prisma.job.count({ where }),
  ]);

  return NextResponse.json({
    jobs,
    pagination: {
      page,
      perPage: JOBS_PER_PAGE,
      total,
      totalPages: Math.ceil(total / JOBS_PER_PAGE),
    },
  });
}
