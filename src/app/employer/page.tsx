import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import {
  formatExperienceLevel,
  formatEmploymentType,
  timeAgo,
} from "@/lib/format";

export const metadata = {
  title: "Employer Dashboard",
};

export const dynamic = "force-dynamic";

export default async function EmployerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
    include: {
      jobs: {
        include: {
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const jobs = company?.jobs ?? [];
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job._count.applications,
    0
  );
  const activeJobs = jobs.filter((j) => j.isActive).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employer Dashboard
          </h1>
          {company && (
            <p className="mt-1 text-gray-600">{company.name}</p>
          )}
        </div>
        <Link
          href="/employer/jobs/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Listings</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {jobs.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Active Listings</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {activeJobs}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Applicants</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {totalApplicants}
          </p>
        </div>
      </div>

      {/* Job Listings */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Your Jobs
        </h2>

        {jobs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 py-16 text-center">
            <p className="text-lg font-medium text-gray-900">
              No jobs posted yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Post your first job to start receiving applicants.
            </p>
            <Link
              href="/employer/jobs/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Post a Job
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/employer/jobs/${job.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{job.title}</p>
                    {!job.isActive && (
                      <Badge variant="red">Closed</Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span>{job.location}</span>
                    {job.isRemote && (
                      <>
                        <span>&middot;</span>
                        <span>Remote</span>
                      </>
                    )}
                    <span>&middot;</span>
                    <span>{formatExperienceLevel(job.experienceLevel)}</span>
                    <span>&middot;</span>
                    <span>{formatEmploymentType(job.employmentType)}</span>
                    <span>&middot;</span>
                    <span>Posted {timeAgo(job.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {job._count.applications}
                    </p>
                    <p className="text-xs text-gray-500">applicants</p>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
