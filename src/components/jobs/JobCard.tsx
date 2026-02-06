import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  formatSalaryRange,
  formatExperienceLevel,
  formatEmploymentType,
  timeAgo,
} from "@/lib/format";

type JobCardProps = {
  job: {
    id: string;
    title: string;
    location: string;
    isRemote: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string;
    employmentType: string;
    techStack: string[];
    createdAt: string;
    company: {
      name: string;
      logo: string | null;
    };
  };
};

const experienceBadgeVariant: Record<string, "green" | "blue" | "amber" | "purple" | "red"> = {
  INTERNSHIP: "green",
  ENTRY: "green",
  MID: "blue",
  SENIOR: "amber",
  LEAD: "purple",
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">
              {job.company.name}
            </span>
            <span>&middot;</span>
            <span>{timeAgo(job.createdAt)}</span>
          </div>

          <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {job.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPinIcon />
              {job.location}
            </span>
            {job.isRemote && (
              <Badge variant="green">Remote</Badge>
            )}
            <span>&middot;</span>
            <span>{formatSalaryRange(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={experienceBadgeVariant[job.experienceLevel] ?? "default"}>
          {formatExperienceLevel(job.experienceLevel)}
        </Badge>
        <Badge>{formatEmploymentType(job.employmentType)}</Badge>
        {job.techStack.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="blue">
            {tech}
          </Badge>
        ))}
        {job.techStack.length > 4 && (
          <Badge>+{job.techStack.length - 4}</Badge>
        )}
      </div>
    </Link>
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
