import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a single file buffer (from multer) to S3 and returns the public URL.
 * File names are randomized so two users can't overwrite each other's uploads.
 */
export async function uploadToS3(file) {
  const uniqueName = `profile-pics/${crypto.randomUUID()}${path.extname(file.originalname)}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;
}

export default s3;
