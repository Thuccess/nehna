import type { Express } from 'express';
import type { Server } from 'node:http';
import { httpJson, startTestServer } from './helpers/httpClient.js';

let app: Express;
let server: Server;

export async function initTestApp(): Promise<Express> {
  if (app) return app;

  const { createApp } = await import('../src/app.js');
  app = await createApp();
  server = startTestServer(app);
  return app;
}

export async function api(
  method: string,
  path: string,
  options?: { body?: unknown; token?: string },
) {
  return httpJson(server, method, path, options);
}
