import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { ExperienceLevel, EmploymentType } from "@prisma/client";

// GET /api/employer/jobs/[id] — get a single job with applicant count
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: { select: { ownerId: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.company.ownerId !== session!.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(job);
}

// PATCH /api/employer/jobs/[id] — update a job listing
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  // Verify ownership
  const existing = await prisma.job.findUnique({
    where: { id },
    include: { company: { select: { ownerId: true } } },
  });

  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (existing.company.ownerId !== session!.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Build update data — only include provided fields
  const updateData: Record<string, unknown> = {};

  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.isRemote !== undefined) updateData.isRemote = body.isRemote;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.techStack !== undefined) updateData.techStack = body.techStack;

  if (body.salaryMin !== undefined) {
    updateData.salaryMin = body.salaryMin ? parseInt(body.salaryMin, 10) : null;
  }
  if (body.salaryMax !== undefined) {
    updateData.salaryMax = body.salaryMax ? parseInt(body.salaryMax, 10) : null;
  }
  if (body.experienceLevel !== undefined) {
    if (!Object.values(ExperienceLevel).includes(body.experienceLevel)) {
      return NextResponse.json(
        { error: "Invalid experience level" },
        { status: 400 }
      );
    }
    updateData.experienceLevel = body.experienceLevel;
  }
  if (body.employmentType !== undefined) {
    if (!Object.values(EmploymentType).includes(body.employmentType)) {
      return NextResponse.json(
        { error: "Invalid employment type" },
        { status: 400 }
      );
    }
    updateData.employmentType = body.employmentType;
  }

  const job = await prisma.job.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(job);
}
