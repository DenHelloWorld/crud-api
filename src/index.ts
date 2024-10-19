import cluster from 'cluster';
import { availableParallelism } from 'os';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes.ts';
import { request } from 'node:http';

const PORT = Number(process.env.PORT) || 4000;
const cpus = availableParallelism();
const isMulti = process.argv.includes('--multi');
let currentWorkerIndex = 1;

if (isMulti && cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 1; i < cpus; i++) {
    cluster.fork({ WORKER_PORT: PORT + i });
  }

  cluster.on('exit', (worker, _code, _signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.url?.startsWith('/api')) {
      const workerPort = PORT + currentWorkerIndex;

      const options = {
        hostname: 'localhost',
        port: workerPort,
        method: req.method,
        path: req.url,
        headers: req.headers,
      };

      const proxyRequest = request(options, workerRes => {
        res.writeHead(workerRes.statusCode || 500, workerRes.headers);
        workerRes.pipe(res, { end: true });
      });

      req.pipe(proxyRequest, { end: true });

      proxyRequest.on('error', err => {
        console.error(err);
        res.writeHead(500);
        res.end('Internal Server Error');
      });

      currentWorkerIndex = (currentWorkerIndex % (cpus - 1)) + 1;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
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
