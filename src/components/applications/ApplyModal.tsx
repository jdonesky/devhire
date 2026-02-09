"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type ApplyModalProps = {
  jobId: string;
  jobTitle: string;
  companyName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ApplyModal({
  jobId,
  jobTitle,
  companyName,
  isOpen,
  onClose,
}: ApplyModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("Please upload a PDF or Word document.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setFile(selected);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let resumeUrl: string | null = null;

      // Upload resume if provided
      if (file) {
        // Get presigned URL
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
          }),
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json();
          throw new Error(data.error ?? "Failed to get upload URL");
        }

        const { presignedUrl, fileUrl } = await uploadRes.json();

        // Upload file directly to S3/MinIO
        const s3Res = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!s3Res.ok) {
          throw new Error("Failed to upload resume");
        }

        resumeUrl = fileUrl;
      }

      // Submit application
      const appRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeUrl,
          coverLetter: coverLetter.trim() || null,
        }),
      });

      if (!appRes.ok) {
        const data = await appRes.json();
        throw new Error(data.error ?? "Failed to submit application");
      }

      setSuccess(true);
      router.refresh();

      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCoverLetter("");
        setFile(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Application Submitted!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your application to {companyName} has been sent.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Apply to {jobTitle}
              </h2>
              <p className="mt-1 text-sm text-gray-500">at {companyName}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resume Upload */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Resume (optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 hover:border-gray-400"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  {file ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadIcon />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload PDF or Word doc
                      </p>
                      <p className="mt-1 text-xs text-gray-400">Max 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label
                  htmlFor="coverLetter"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Cover Letter (optional)
                </label>
                <textarea
                  id="coverLetter"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      className="mx-auto h-8 w-8 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}
