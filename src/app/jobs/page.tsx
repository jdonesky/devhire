import { Suspense } from "react";
import { SearchBar } from "@/components/jobs/SearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobCard } from "@/components/jobs/JobCard";
import { Pagination } from "@/components/jobs/Pagination";
import { prisma } from "@/lib/prisma";
import { Prisma, ExperienceLevel, EmploymentType } from "@prisma/client";

export const metadata = {
  title: "Browse Jobs",
};

// Force dynamic rendering so search params are always fresh
export const dynamic = "force-dynamic";

const JOBS_PER_PAGE = 12;

async function getJobs(searchParams: Record<string, string | undefined>) {
  const query = searchParams.q ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const experienceLevel = searchParams.experience as ExperienceLevel | null;
  const employmentType = searchParams.type as EmploymentType | null;
  const isRemote = searchParams.remote;
  const salaryMin = searchParams.salaryMin;
  const tech = searchParams.tech;
  const sortBy = searchParams.sort ?? "newest";

  // ── Full-text search via raw SQL ────────────────────────────────
  if (query.trim()) {
    const tsQuery = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => `${word}:*`)
      .join(" & ");

    const offset = (page - 1) * JOBS_PER_PAGE;

    const conditions: string[] = ['"isActive" = true'];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

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

    const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM "Job" WHERE ${whereClause}`,
      ...params
    );
    const total = Number(countResult[0].count);

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

    const jobRows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT "id" FROM "Job" WHERE ${whereClause} ORDER BY ${orderClause} LIMIT ${JOBS_PER_PAGE} OFFSET ${offset}`,
      ...params
    );

    const jobIds = jobRows.map((r) => r.id);

    const jobs =
      jobIds.length > 0
        ? await prisma.job.findMany({
            where: { id: { in: jobIds } },
            include: { company: { select: { id: true, name: true, logo: true } } },
          })
        : [];

    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const orderedJobs = jobIds.map((id) => jobMap.get(id)).filter((j): j is NonNullable<typeof j> => Boolean(j));

    return {
      jobs: orderedJobs,
      pagination: {
        page,
        perPage: JOBS_PER_PAGE,
        total,
        totalPages: Math.ceil(total / JOBS_PER_PAGE),
      },
    };
  }

  // ── Non-search query (browse mode) ─────────────────────────────
  const where: Prisma.JobWhereInput = { isActive: true };

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

  return {
    jobs,
    pagination: {
      page,
      perPage: JOBS_PER_PAGE,
      total,
      totalPages: Math.ceil(total / JOBS_PER_PAGE),
    },
  };
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const { jobs, pagination } = await getJobs(resolvedParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="mt-1 text-gray-600">
          Find your next role. Search by title, tech stack, or keyword.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-gray-100" />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-gray-100" />}>
          <JobFilters />
        </Suspense>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-lg font-medium text-gray-900">No jobs found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
          </div>
        </>
      )}
    </div>
  );
}
