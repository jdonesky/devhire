import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// GET /api/employer/jobs/[id]/applicants — list applicants for a job
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // Verify job ownership
  const job = await prisma.job.findUnique({
    where: { id },
    include: { company: { select: { ownerId: true } } },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.company.ownerId !== session!.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applicants = await prisma.application.findMany({
    where: { jobId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json(applicants);
}
