export default function JobDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-24 animate-pulse rounded bg-gray-100" />

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="mt-3 h-9 w-96 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 flex gap-3">
          <div className="h-6 w-28 animate-pulse rounded-full bg-gray-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-6 w-36 animate-pulse rounded bg-gray-200" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-100" />
          ))}
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="mb-4 space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
              <div className="h-7 w-36 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-12 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
