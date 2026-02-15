export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-100" />
      </div>

      {/* Search skeleton */}
      <div className="mb-6 space-y-4">
        <div className="h-11 animate-pulse rounded-lg bg-gray-100" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Job cards skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                </div>
                <div className="mt-2 h-6 w-64 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 flex gap-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
