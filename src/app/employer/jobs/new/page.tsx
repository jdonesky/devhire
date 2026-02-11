import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JobForm } from "@/components/employer/JobForm";

export const metadata = {
  title: "Post a Job",
};

export default async function NewJobPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="mt-1 text-gray-600">
          Fill out the form below to create a new job listing.
        </p>
      </div>

      <JobForm />
    </div>
  );
}
