"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const EXPERIENCE_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "ENTRY", label: "Entry Level" },
  { value: "MID", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEAD", label: "Lead" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
];

const SALARY_OPTIONS = [
  { value: "", label: "Any Salary" },
  { value: "50000", label: "$50k+" },
  { value: "80000", label: "$80k+" },
  { value: "100000", label: "$100k+" },
  { value: "130000", label: "$130k+" },
  { value: "160000", label: "$160k+" },
  { value: "200000", label: "$200k+" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary", label: "Highest Salary" },
];

const TECH_OPTIONS = [
  { value: "", label: "All Tech" },
  { value: "React", label: "React" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Node.js", label: "Node.js" },
  { value: "Next.js", label: "Next.js" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "Python", label: "Python" },
  { value: "Docker", label: "Docker" },
  { value: "AWS", label: "AWS" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "Redis", label: "Redis" },
  { value: "Tailwind CSS", label: "Tailwind CSS" },
  { value: "WebSocket", label: "WebSocket" },
  { value: "React Native", label: "React Native" },
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/jobs?${params.toString()}`);
    },
    [searchParams, router]
  );

  const activeFilterCount = [
    searchParams.get("experience"),
    searchParams.get("type"),
    searchParams.get("salaryMin"),
    searchParams.get("remote"),
    searchParams.get("tech"),
  ].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    router.push(`/jobs?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <FilterSelect
          options={EXPERIENCE_OPTIONS}
          value={searchParams.get("experience") ?? ""}
          onChange={(v) => setFilter("experience", v)}
        />
        <FilterSelect
          options={EMPLOYMENT_OPTIONS}
          value={searchParams.get("type") ?? ""}
          onChange={(v) => setFilter("type", v)}
        />
        <FilterSelect
          options={SALARY_OPTIONS}
          value={searchParams.get("salaryMin") ?? ""}
          onChange={(v) => setFilter("salaryMin", v)}
        />
        <FilterSelect
          options={TECH_OPTIONS}
          value={searchParams.get("tech") ?? ""}
          onChange={(v) => setFilter("tech", v)}
        />
        <FilterSelect
          options={SORT_OPTIONS}
          value={searchParams.get("sort") ?? "newest"}
          onChange={(v) => setFilter("sort", v)}
        />

        {/* Remote toggle */}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
          <input
            type="checkbox"
            checked={searchParams.get("remote") === "true"}
            onChange={(e) =>
              setFilter("remote", e.target.checked ? "true" : "")
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Remote Only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
