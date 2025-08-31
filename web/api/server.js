import Fastify from "fastify";
import cors from "@fastify/cors";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

process.on('unhandledRejection', (reason, promise) => {
  // logged
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

  // the app goes on without WattPM
})

async function skipUnhandled() {
  await sleep(300);
  throw Error('Some unhandled async error');
}

export async function build() {
  // imitate a longer start of a new worker
  await sleep(5000);

  const fastify = Fastify({
    logger: { level: globalThis.platformatic?.logLevel ?? "info" },
  });

  fastify.register(cors, {
    origin: true,
  });

  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.get("/unhandled-rejection", async (request, reply) => {
    // note: no await - unhandled rejection
    skipUnhandled();
    return { hello: "running unhandled rejection" };
  });

  fastify.addHook('onClose', async () => {
    // reeaaly long closing step - a bug, a glitch, uncleared timer/connection or whatever
    // but still less than default gracefulShutdown 20s
    await sleep(11000);

    console.log('clean up hook');
  })

  return fastify;
}

if (!globalThis.platformatic) {
  const server = await build();

  await server.listen({port: 3042});
}
