import { createServer, IncomingMessage, ServerResponse, request } from 'node:http';
import { parse } from 'node:url';
import cluster from 'node:cluster';
import { userRoutes } from './routes/user.routes.ts';
import { availableParallelism } from 'node:os';
import './worker.ts';
import { fork } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import launchDb, { DB_PORT } from './dbServer.ts';
import { setTimeout } from 'node:timers/promises';
import launchWorker from './worker.ts';

const PORT = Number(process.env.PORT) || 4000;
const isMulti = process.argv.includes('--multi');
const numWorkers = Math.max(0, availableParallelism() - 2);
const workerPorts: number[] = Array.from({ length: numWorkers }, (_, i) => 4001 + i);

let currentWorkerIndex = 0;

const forwardRequestToWorker = (req: IncomingMessage, res: ServerResponse) => {
  const workerPort = workerPorts[currentWorkerIndex];

  // Пересылаем запрос на текущий порт воркера
  const workerReq = request(
    {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    workerRes => {
      res.writeHead(workerRes.statusCode || 500, workerRes.headers);
      workerRes.pipe(res, { end: true });
    },
  );

  req.pipe(workerReq, { end: true });

  currentWorkerIndex = (currentWorkerIndex + 1) % workerPorts.length;

  workerReq.on('error', err => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error connecting to worker: ${err.message}`);
  });
};

const launchBalancer = async () => {
  if (!isMulti) {
    // Если однопоточный режим
    const app = createServer((req: IncomingMessage, res: ServerResponse) => {
      const parsedUrl = parse(req.url || '', true);
      userRoutes(req, res, parsedUrl); // Обработка запроса
    });

    app.listen(PORT, () => {
      console.log(`Balancer Server ${process.pid} is listening on port ${PORT} without horizontal scaling`);
    });
  } else {
    if (cluster.isPrimary) {

      const app = createServer((req: IncomingMessage, res: ServerResponse) => {
        forwardRequestToWorker(req, res);
      });
      const dbFork = cluster.fork({ DB_FORKED_PORT: DB_PORT }).on('online', () => {
        console.log(`dbFork ${dbFork.process.pid} launched on ${DB_PORT}`);
      });
      app.listen(PORT, () => {
        console.log(`Load balancer running on port ${PORT}`);
      });

      workerPorts.forEach(port => {
        const worker = cluster.fork({ WORKER_PORT: port }).on('online', () => {
          console.log(`Worker ${worker.process.pid} launched on ${port}`);
        });
      });
    } else if (cluster.isWorker) {
      if (process.env.WORKER_PORT) {
        console.log(process.env.WORKER_PORT);
        launchWorker(+process.env.WORKER_PORT);
      } else if (process.env.DB_FORKED_PORT) {
        launchDb(+process.env.DB_FORKED_PORT);
      }
    }
  }
};
launchBalancer();
process.on('message', msg => {
  console.log('Получено сообщение от worker-процесса:', msg);
});
