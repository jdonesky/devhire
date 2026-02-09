"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type SaveJobButtonProps = {
  jobId: string;
  initialSaved: boolean;
};

export function SaveJobButton({ jobId, initialSaved }: SaveJobButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: saved ? "DELETE" : "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
        router.refresh();
      }
    } catch {
      // Silently fail — button reverts
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        saved
          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <HeartIcon filled={saved} />
      {saved ? "Saved" : "Save Job"}
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? "text-blue-600" : "text-gray-400"}`}
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}
