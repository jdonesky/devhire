"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXPERIENCE_OPTIONS = [
  { value: "INTERNSHIP", label: "Internship" },
  { value: "ENTRY", label: "Entry Level" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
];

const COMMON_TECH = [
  "React", "TypeScript", "JavaScript", "Node.js", "Next.js",
  "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS",
  "Python", "Go", "GraphQL", "Tailwind CSS", "Jest",
  "Express", "Prisma", "WebSocket", "Kubernetes", "Terraform",
];

type JobFormProps = {
  initialData?: {
    id: string;
    title: string;
    description: string;
    location: string;
    isRemote: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    experienceLevel: string;
    employmentType: string;
    techStack: string[];
    isActive: boolean;
  };
};

export function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    location: initialData?.location ?? "",
    isRemote: initialData?.isRemote ?? false,
    salaryMin: initialData?.salaryMin?.toString() ?? "",
    salaryMax: initialData?.salaryMax?.toString() ?? "",
    experienceLevel: initialData?.experienceLevel ?? "MID",
    employmentType: initialData?.employmentType ?? "FULL_TIME",
    techStack: initialData?.techStack ?? [],
    isActive: initialData?.isActive ?? true,
  });

  const [customTech, setCustomTech] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const addCustomTech = () => {
    const trimmed = customTech.trim();
    if (trimmed && !formData.techStack.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, trimmed],
      }));
      setCustomTech("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/employer/jobs/${initialData!.id}`
        : "/api/employer/jobs";

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save job");
      }

      const job = await res.json();
      router.push(`/employer/jobs/${job.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          Job Title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          placeholder="e.g. Senior Frontend Engineer"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Job Description *
        </label>
        <textarea
          id="description"
          required
          rows={8}
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Location + Remote */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
            Location *
          </label>
          <input
            id="location"
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
            placeholder="e.g. San Francisco, CA"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.isRemote}
              onChange={(e) => setFormData((p) => ({ ...p, isRemote: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Remote position
          </label>
        </div>
      </div>

      {/* Salary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="salaryMin" className="mb-1 block text-sm font-medium text-gray-700">
            Salary Min (USD/year)
          </label>
          <input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData((p) => ({ ...p, salaryMin: e.target.value }))}
            placeholder="e.g. 120000"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="salaryMax" className="mb-1 block text-sm font-medium text-gray-700">
            Salary Max (USD/year)
          </label>
          <input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData((p) => ({ ...p, salaryMax: e.target.value }))}
            placeholder="e.g. 180000"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Experience + Employment Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="experienceLevel" className="mb-1 block text-sm font-medium text-gray-700">
            Experience Level *
          </label>
          <select
            id="experienceLevel"
            value={formData.experienceLevel}
            onChange={(e) => setFormData((p) => ({ ...p, experienceLevel: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="employmentType" className="mb-1 block text-sm font-medium text-gray-700">
            Employment Type
          </label>
          <select
            id="employmentType"
            value={formData.employmentType}
            onChange={(e) => setFormData((p) => ({ ...p, employmentType: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tech Stack
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TECH.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                formData.techStack.includes(tech)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTech())}
            placeholder="Add custom tech..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addCustomTech}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        {formData.techStack.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Selected: {formData.techStack.join(", ")}
          </p>
        )}
      </div>

      {/* Active toggle (edit only) */}
      {isEditing && (
        <div>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="font-medium text-gray-700">Listing is active</span>
            <span className="text-gray-400">
              (uncheck to close this position)
            </span>
          </label>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Job"
            : "Post Job"}
        </button>
      </div>
    </form>
  );
}
