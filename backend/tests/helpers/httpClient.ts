import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import http from 'node:http';

type JsonResponse = {
  status: number;
  body: Record<string, unknown>;
};

export function startTestServer(app: import('express').Express): Server {
  return app.listen(0);
}

export function httpJson(
  server: Server,
  method: string,
  path: string,
  options?: { body?: unknown; token?: string },
): Promise<JsonResponse> {
  const { port } = server.address() as AddressInfo;

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 500,
            body: raw ? (JSON.parse(raw) as Record<string, unknown>) : {},
          });
        });
      },
    );

    req.on('error', reject);
    if (options?.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}
