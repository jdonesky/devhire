import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { JobForm } from "@/components/employer/JobForm";
import { ApplicantList } from "@/components/employer/ApplicantList";
import {
  formatSalaryRange,
  formatExperienceLevel,
  formatEmploymentType,
  timeAgo,
} from "@/lib/format";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: job ? `Manage: ${job.title}` : "Job Not Found",
  };
}

export default async function ManageJobPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: { select: { ownerId: true, name: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    notFound();
  }

  if (job.company.ownerId !== session.user.id) {
    redirect("/employer");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/employer"
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
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            {!job.isActive && <Badge variant="red">Closed</Badge>}
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>{job.location}</span>
            {job.isRemote && (
              <>
                <span>&middot;</span>
                <Badge variant="green">Remote</Badge>
              </>
            )}
            <span>&middot;</span>
            <span>{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
            <span>&middot;</span>
            <span>Posted {timeAgo(job.createdAt)}</span>
          </div>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          target="_blank"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Public Listing
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Applicants */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Applicants ({job._count.applications})
          </h2>
          <ApplicantList jobId={job.id} />
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Edit Listing
          </h2>
          <JobForm
            initialData={{
              id: job.id,
              title: job.title,
              description: job.description,
              location: job.location,
              isRemote: job.isRemote,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              experienceLevel: job.experienceLevel,
              employmentType: job.employmentType,
              techStack: job.techStack,
              isActive: job.isActive,
            }}
          />
        </div>
      </div>
    </div>
  );
}
