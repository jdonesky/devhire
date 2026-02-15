import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Job not found
        </h2>
        <p className="mt-2 text-gray-600">
          This job listing may have been removed or the URL is incorrect.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Browse All Jobs
        </Link>
      </div>
    </div>
  );
}
