import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

// POST /api/upload — get a presigned URL for resume upload
export async function POST(request: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { fileName, contentType } = body;

  if (!fileName || !contentType) {
    return NextResponse.json(
      { error: "fileName and contentType are required" },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(contentType)) {
    return NextResponse.json(
      { error: "Only PDF and Word documents are allowed" },
      { status: 400 }
    );
  }

  // Generate a unique key
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `resumes/${session!.user.id}/${timestamp}-${sanitizedName}`;

  // Create presigned URL for direct upload
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes
  });

  // Save resume record
  const fileUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${key}`;

  const resume = await prisma.resume.create({
    data: {
      userId: session!.user.id,
      fileUrl,
      fileName,
    },
  });

  return NextResponse.json({
    presignedUrl,
    fileUrl,
    resumeId: resume.id,
  });
}
