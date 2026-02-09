import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import {
  formatSalaryRange,
  formatExperienceLevel,
  formatEmploymentType,
  timeAgo,
} from "@/lib/format";

export const metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

const statusColors: Record<string, "default" | "blue" | "green" | "amber" | "purple" | "red"> = {
  PENDING: "default",
  REVIEWING: "blue",
  INTERVIEW: "purple",
  OFFERED: "green",
  REJECTED: "red",
  WITHDRAWN: "default",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [applications, savedJobs] = await Promise.all([
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            company: { select: { name: true } },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.savedJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: {
            company: { select: { name: true } },
          },
        },
      },
      orderBy: { savedAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Track your applications and saved jobs.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Applications" value={applications.length} />
        <StatCard
          label="Interviews"
          value={
            applications.filter((a) => a.status === "INTERVIEW").length
          }
        />
        <StatCard label="Saved Jobs" value={savedJobs.length} />
      </div>

      {/* Applications */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          My Applications ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 py-12 text-center">
            <p className="text-gray-500">No applications yet.</p>
            <Link
              href="/jobs"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/jobs/${app.jobId}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {app.job.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <span>{app.job.company.name}</span>
                    <span>&middot;</span>
                    <span>{app.job.location}</span>
                    <span>&middot;</span>
                    <span>Applied {timeAgo(app.appliedAt)}</span>
                  </div>
                </div>
                <Badge variant={statusColors[app.status]}>
                  {statusLabels[app.status] ?? app.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Saved Jobs */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Saved Jobs ({savedJobs.length})
        </h2>

        {savedJobs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 py-12 text-center">
            <p className="text-gray-500">No saved jobs.</p>
            <Link
              href="/jobs"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map((saved) => (
              <Link
                key={saved.id}
                href={`/jobs/${saved.jobId}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">
                    {saved.job.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>{saved.job.company.name}</span>
                    <span>&middot;</span>
                    <span>{saved.job.location}</span>
                    <span>&middot;</span>
                    <span>
                      {formatSalaryRange(
                        saved.job.salaryMin,
                        saved.job.salaryMax
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    ({"INTERNSHIP": "green", "ENTRY": "green", "MID": "blue", "SENIOR": "amber", "LEAD": "purple"} as Record<string, "green" | "blue" | "amber" | "purple">)[saved.job.experienceLevel] ?? "default"
                  }>
                    {formatExperienceLevel(saved.job.experienceLevel)}
                  </Badge>
                  <Badge>
                    {formatEmploymentType(saved.job.employmentType)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
