import { connectMongo } from './db/connect.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createApp } from './app.js';

async function main(): Promise<void> {
  await connectMongo();
  const app = await createApp();
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Adulis API listening');
  });
}

main().catch((err) => {
  logger.error({ err }, 'Fatal error during boot');
  process.exit(1);
});
