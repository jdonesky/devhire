import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { ExperienceLevel, EmploymentType } from "@prisma/client";

// GET /api/employer/jobs — list employer's own jobs
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  // Get employer's company
  const company = await prisma.company.findUnique({
    where: { ownerId: session!.user.id },
    select: { id: true },
  });

  if (!company) {
    return NextResponse.json({ jobs: [] });
  }

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

// POST /api/employer/jobs — create a new job listing
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const {
    title,
    description,
    location,
    isRemote,
    salaryMin,
    salaryMax,
    experienceLevel,
    employmentType,
    techStack,
  } = body;

  // Validate required fields
  if (!title || !description || !location || !experienceLevel) {
    return NextResponse.json(
      { error: "title, description, location, and experienceLevel are required" },
      { status: 400 }
    );
  }

  if (!Object.values(ExperienceLevel).includes(experienceLevel)) {
    return NextResponse.json(
      { error: "Invalid experience level" },
      { status: 400 }
    );
  }

  // Get or create employer's company
  let company = await prisma.company.findUnique({
    where: { ownerId: session!.user.id },
  });

  if (!company) {
    // Auto-create a company for the employer
    company = await prisma.company.create({
      data: {
        name: `${session!.user.name ?? "My"}'s Company`,
        ownerId: session!.user.id,
      },
    });

    // Update user role to EMPLOYER
    await prisma.user.update({
      where: { id: session!.user.id },
      data: { role: "EMPLOYER" },
    });
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      isRemote: isRemote ?? false,
      salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
      salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
      experienceLevel,
      employmentType: employmentType ?? EmploymentType.FULL_TIME,
      techStack: techStack ?? [],
      companyId: company.id,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
