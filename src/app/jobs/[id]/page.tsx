import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { JobActions } from "@/components/applications/JobActions";
import {
  formatSalaryRange,
  formatExperienceLevel,
  formatEmploymentType,
  timeAgo,
} from "@/lib/format";
import type { Metadata } from "next";

// ISR: revalidate every 60 seconds
export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      _count: { select: { applications: true } },
    },
  });
  return job;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.description.slice(0, 160),
  };
}

const experienceBadgeVariant: Record<string, "green" | "blue" | "amber" | "purple" | "red"> = {
  INTERNSHIP: "green",
  ENTRY: "green",
  MID: "blue",
  SENIOR: "amber",
  LEAD: "purple",
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const [job, session] = await Promise.all([
    getJob(id),
    getServerSession(authOptions),
  ]);

  if (!job) {
    notFound();
  }

  // Check if current user has applied or saved this job
  let hasApplied = false;
  let isSaved = false;

  if (session?.user?.id) {
    const [application, savedJob] = await Promise.all([
      prisma.application.findUnique({
        where: {
          userId_jobId: { userId: session.user.id, jobId: id },
        },
        select: { id: true },
      }),
      prisma.savedJob.findUnique({
        where: {
          userId_jobId: { userId: session.user.id, jobId: id },
        },
        select: { id: true },
      }),
    ]);
    hasApplied = !!application;
    isSaved = !!savedJob;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Jobs
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{job.company.name}</span>
          {job.company.website && (
            <>
              <span>&middot;</span>
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Website
              </a>
            </>
          )}
          <span>&middot;</span>
          <span>Posted {timeAgo(job.createdAt)}</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">{job.title}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <MapPinIcon />
            {job.location}
          </span>
          {job.isRemote && <Badge variant="green">Remote</Badge>}
          <Badge variant={experienceBadgeVariant[job.experienceLevel] ?? "default"}>
            {formatExperienceLevel(job.experienceLevel)}
          </Badge>
          <Badge>{formatEmploymentType(job.employmentType)}</Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Description */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              About this role
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600">
              {job.description.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.techStack.map((tech) => (
                <Link
                  key={tech}
                  href={`/jobs?tech=${encodeURIComponent(tech)}`}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  {tech}
                </Link>
              ))}
            </div>
          </section>

          {/* Company */}
          {job.company.description && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                About {job.company.name}
              </h2>
              <p className="text-gray-600">{job.company.description}</p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-xl border border-gray-200 p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">Salary Range</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatSalaryRange(job.salaryMin, job.salaryMax)}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500">Applicants</p>
              <p className="text-xl font-semibold text-gray-900">
                {job._count.applications}
              </p>
            </div>

            <JobActions
              jobId={job.id}
              jobTitle={job.title}
              companyName={job.company.name}
              hasApplied={hasApplied}
              isSaved={isSaved}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
