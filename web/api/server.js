import Fastify from "fastify";
import cors from "@fastify/cors";

import path from "path";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
})

async function skipUnhandled() {
  await sleep(300);
  throw Error('Some unhandled async error');
}

export async function build() {
  console.log('starting fastify app');
  // imitate a longer start of a new worker
  await sleep(2000);

  const fastify = Fastify({
    logger: { level: "info" },
  });

  fastify.register(cors, {
    origin: true,
  });

  fastify.get("/", async (request, reply) => {
    await sleep(5000);
    return { hello: "world" };
  });

  fastify.get("/unhandled-rejection", async (request, reply) => {
    // note: no await - unhandled rejection
    skipUnhandled();
    return { hello: "running unhandled rejection" };
  });

  fastify.addHook('onClose', async () => {
    console.log('Actually closing the app');
    // reeaally long closing step
    // but still less than current gracefulShutdown timeout
    await sleep(2000);

    fastify.log.info('clean up ready');
  })

  return fastify;
}
