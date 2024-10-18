import cluster from 'cluster';
import { availableParallelism } from 'os';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes.ts';

const PORT = Number(process.env.PORT) || 4000;
const cpus = availableParallelism();
const isMulti = process.argv.includes('--multi');

if (isMulti && cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 1; i < cpus; i++) {
    cluster.fork({ WORKER_PORT: PORT + i });
  }

  cluster.on('exit', (worker, _code, _signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  createServer((req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Load balancer is listening');
  }).listen(PORT, () => {
    console.log(`Load balancer is listening on port ${PORT}`);
  });
} else {
  const workerPort = Number(process.env.WORKER_PORT) || PORT + (cluster.worker?.id ?? 0);
  const app = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    userRoutes(req, res, parsedUrl);
  });

  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
  });
}
