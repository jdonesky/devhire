import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// GET /api/applications — list current user's applications
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const applications = await prisma.application.findMany({
    where: { userId: session!.user.id },
    include: {
      job: {
        include: {
          company: { select: { id: true, name: true, logo: true } },
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json(applications);
}

// POST /api/applications — apply to a job
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { jobId, resumeUrl, coverLetter } = body;

  if (!jobId) {
    return NextResponse.json(
      { error: "jobId is required" },
      { status: 400 }
    );
  }

  // Check job exists and is active
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, isActive: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (!job.isActive) {
    return NextResponse.json(
      { error: "This job is no longer accepting applications" },
      { status: 400 }
    );
  }

  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId: session!.user.id,
        jobId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already applied to this job" },
      { status: 409 }
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: session!.user.id,
      jobId,
      resumeUrl: resumeUrl ?? null,
      coverLetter: coverLetter ?? null,
    },
    include: {
      job: {
        include: {
          company: { select: { id: true, name: true, logo: true } },
        },
      },
    },
  });

  return NextResponse.json(application, { status: 201 });
}
