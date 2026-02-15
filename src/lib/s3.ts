import { S3Client } from "@aws-sdk/client-s3";

const s3Config: Record<string, unknown> = {
  region: process.env.S3_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
};

// Use custom endpoint + path style for local MinIO; omit for real AWS S3
if (process.env.S3_ENDPOINT) {
  s3Config.endpoint = process.env.S3_ENDPOINT;
  s3Config.forcePathStyle = true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const s3Client = new S3Client(s3Config as any);

export const S3_BUCKET = process.env.S3_BUCKET ?? "devhire-resumes";
