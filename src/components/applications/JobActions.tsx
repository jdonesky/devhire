"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ApplyModal } from "./ApplyModal";
import { SaveJobButton } from "./SaveJobButton";

type JobActionsProps = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  hasApplied: boolean;
  isSaved: boolean;
};

export function JobActions({
  jobId,
  jobTitle,
  companyName,
  hasApplied,
  isSaved,
}: JobActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setShowApplyModal(true);
  };

  return (
    <>
      <div className="space-y-3">
        {hasApplied ? (
          <div className="w-full rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
            Applied
          </div>
        ) : (
          <button
            onClick={handleApplyClick}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Apply Now
          </button>
        )}

        <SaveJobButton jobId={jobId} initialSaved={isSaved} />

        {!session && (
          <p className="text-center text-xs text-gray-400">
            Sign in to apply and track your application
          </p>
        )}
      </div>

      <ApplyModal
        jobId={jobId}
        jobTitle={jobTitle}
        companyName={companyName}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
      />
    </>
  );
}
