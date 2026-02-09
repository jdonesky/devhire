import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// POST /api/jobs/[id]/save — save/bookmark a job
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: jobId } = await params;

  // Check job exists
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // Check if already saved
  const existing = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId: session!.user.id,
        jobId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ saved: true, message: "Already saved" });
  }

  await prisma.savedJob.create({
    data: {
      userId: session!.user.id,
      jobId,
    },
  });

  return NextResponse.json({ saved: true }, { status: 201 });
}

// DELETE /api/jobs/[id]/save — unsave/unbookmark a job
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id: jobId } = await params;

  await prisma.savedJob.deleteMany({
    where: {
      userId: session!.user.id,
      jobId,
    },
  });

  return NextResponse.json({ saved: false });
}
