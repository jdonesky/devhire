"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/format";

type Applicant = {
  id: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: string;
  appliedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

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

export function ApplicantList({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/employer/jobs/${jobId}/applicants`)
      .then((res) => res.json())
      .then(setApplicants)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 py-12 text-center">
        <p className="text-gray-500">No applicants yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applicants.map((app) => (
        <div
          key={app.id}
          className="rounded-xl border border-gray-200 bg-white"
        >
          <button
            onClick={() =>
              setExpandedId(expandedId === app.id ? null : app.id)
            }
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              {app.user.image ? (
                <img
                  src={app.user.image}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                  {(app.user.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {app.user.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-gray-500">
                  {app.user.email} &middot; Applied {timeAgo(app.appliedAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={statusColors[app.status]}>
                {statusLabels[app.status] ?? app.status}
              </Badge>
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  expandedId === app.id ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </button>

          {expandedId === app.id && (
            <div className="border-t border-gray-100 px-4 py-4">
              {app.coverLetter && (
                <div className="mb-4">
                  <p className="mb-1 text-sm font-medium text-gray-700">
                    Cover Letter
                  </p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {app.coverLetter}
                  </p>
                </div>
              )}
              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
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
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  View Resume
                </a>
              )}
              {!app.coverLetter && !app.resumeUrl && (
                <p className="text-sm text-gray-400">
                  No cover letter or resume attached.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
