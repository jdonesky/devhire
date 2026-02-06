import { Suspense } from "react";
import { SearchBar } from "@/components/jobs/SearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobCard } from "@/components/jobs/JobCard";
import { Pagination } from "@/components/jobs/Pagination";

export const metadata = {
  title: "Browse Jobs",
};

// Force dynamic rendering so search params are always fresh
export const dynamic = "force-dynamic";

type JobsResponse = {
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    isRemote: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string;
    employmentType: string;
    techStack: string[];
    createdAt: string;
    company: {
      id: string;
      name: string;
      logo: string | null;
    };
  }>;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

async function getJobs(
  searchParams: Record<string, string | undefined>
): Promise<JobsResponse> {
  const params = new URLSearchParams();

  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.experience) params.set("experience", searchParams.experience);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.salaryMin) params.set("salaryMin", searchParams.salaryMin);
  if (searchParams.remote) params.set("remote", searchParams.remote);
  if (searchParams.tech) params.set("tech", searchParams.tech);
  if (searchParams.sort) params.set("sort", searchParams.sort);

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/jobs?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
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
