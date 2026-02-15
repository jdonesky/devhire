export default function EmployerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-9 w-56 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-5 w-36 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-5">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
            <div className="mt-2 h-9 w-12 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="mb-4 h-7 w-32 animate-pulse rounded bg-gray-200" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 flex gap-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
