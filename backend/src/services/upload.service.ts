import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import type { UploadKind } from '@adulis/shared';
import { env, isR2Configured } from '../config/env.js';
import { HttpError } from '../middlewares/errorHandler.js';

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!isR2Configured) throw new HttpError(503, 'Cloudflare R2 is not configured');
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return cachedClient;
}

function extOf(contentType: string, fallback = 'bin'): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return map[contentType.toLowerCase()] ?? fallback;
}

export interface PresignArgs {
  userId: string;
  kind: UploadKind;
  contentType: string;
  filename?: string;
}

export async function createUploadPresignedUrl(
  args: PresignArgs,
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  if (!isR2Configured) throw new HttpError(503, 'Cloudflare R2 is not configured');
  const client = getR2Client();
  const ext = extOf(args.contentType);
  const key = `${args.kind}/${args.userId}/${Date.now()}-${randomUUID()}.${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: env.R2_BUCKET!,
    Key: key,
    ContentType: args.contentType,
  });
  const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 60 * 15 });
  const publicUrl = `${env.R2_PUBLIC_BASE_URL!.replace(/\/$/, '')}/${key}`;
  return { uploadUrl, publicUrl, key };
}
