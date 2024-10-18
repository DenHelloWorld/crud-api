import cluster from 'cluster';
import os from 'os';
import { app } from './app.ts';


const PORT = Number(process.env.PORT) || 3000;
const isCluster = process.argv.includes('--mult');

if (isCluster && cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    const workerPort = PORT + i;
    cluster.fork({ PORT: workerPort });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker process
  const workerPort = Number(process.env.PORT) || PORT;



  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is listening on port ${workerPort}`);
  });

  app.on('request', (req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Hello World from worker ' + process.pid);
    }
  });
}
