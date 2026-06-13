import type { UploadKind } from '@adulis/shared';
import { api } from './api';

export async function uploadToR2(
  file: File,
  kind: UploadKind,
): Promise<{ publicUrl: string; key: string }> {
  const presign = await api.presignUpload({
    contentType: file.type || 'application/octet-stream',
    kind,
    filename: file.name,
  });

  const res = await fetch(presign.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Upload to R2 failed (${res.status})`);
  }

  return { publicUrl: presign.publicUrl, key: presign.key };
}
