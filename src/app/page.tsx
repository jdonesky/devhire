import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find your next{" "}
            <span className="text-blue-600">developer role</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Search thousands of remote and on-site positions. Filter by tech
            stack, experience level, and salary range. Apply with one click.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Browse Jobs
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Full-Text Search"
              description="Powered by PostgreSQL tsvector. Search job titles, descriptions, and tech stacks with instant ranked results."
            />
            <FeatureCard
              title="Smart Filtering"
              description="Filter by location, experience level, salary range, employment type, and tech stack. Combine filters for precision."
            />
            <FeatureCard
              title="One-Click Apply"
              description="Upload your resume once, then apply to jobs instantly. Track all your applications from a single dashboard."
            />
            <FeatureCard
              title="Resume Uploads"
              description="S3-compatible file storage with presigned URLs. Secure, fast, and production-ready upload pipeline."
            />
            <FeatureCard
              title="Employer Dashboard"
              description="Post jobs, manage listings, and review applicants. Role-based access separates seekers from employers."
            />
            <FeatureCard
              title="Server-Side Rendered"
              description="Built with Next.js App Router. SSR for search results, ISR for job details. Fast, SEO-friendly pages."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
