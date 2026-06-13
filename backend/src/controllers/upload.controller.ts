import type { RequestHandler } from 'express';
import type { PresignInput } from '@adulis/shared';
import { createUploadPresignedUrl } from '../services/upload.service.js';

export const uploadController = {
  presign: (async (req, res) => {
    const input = req.body as PresignInput;
    const result = await createUploadPresignedUrl({
      userId: req.user!.sub,
      kind: input.kind,
      contentType: input.contentType,
      filename: input.filename,
    });
    res.json(result);
  }) as RequestHandler,
};
