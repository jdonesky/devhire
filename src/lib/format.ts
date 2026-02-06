/**
 * Format a salary number as a compact USD string.
 * Values < 1000 are treated as hourly rates.
 */
export function formatSalary(amount: number | null): string {
  if (amount === null) return "";
  if (amount < 1000) return `$${amount}/hr`;
  return `$${(amount / 1000).toFixed(0)}k`;
}

/**
 * Format a salary range string.
 */
export function formatSalaryRange(
  min: number | null,
  max: number | null
): string {
  if (min === null && max === null) return "Salary not listed";
  if (min !== null && max !== null)
    return `${formatSalary(min)} – ${formatSalary(max)}`;
  if (min !== null) return `From ${formatSalary(min)}`;
  return `Up to ${formatSalary(max)}`;
}

/**
 * Format experience level enum to readable string.
 */
export function formatExperienceLevel(level: string): string {
  const map: Record<string, string> = {
    INTERNSHIP: "Internship",
    ENTRY: "Entry Level",
    MID: "Mid Level",
    SENIOR: "Senior",
    LEAD: "Lead",
  };
  return map[level] ?? level;
}

/**
 * Format employment type enum to readable string.
 */
export function formatEmploymentType(type: string): string {
  const map: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    FREELANCE: "Freelance",
  };
  return map[type] ?? type;
}

/**
 * Relative time string (e.g., "2 days ago").
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
