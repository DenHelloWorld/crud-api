import { createServer, IncomingMessage, request, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes.ts';
import { DB_PORT } from './dbServer.ts';

const launchWorker = (port: number) => {
  const app = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);

    userRoutes(req, res, parsedUrl);

    const dbReq = request(
      {
        hostname: 'localhost',
        port: DB_PORT,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      dbRes => {
        if (!res.headersSent) {
          res.writeHead(dbRes.statusCode || 500, dbRes.headers);
        }
        dbRes.pipe(res, { end: true });
      },
    );

    req.pipe(dbReq, { end: true });

    dbReq.on('error', err => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error connecting to database: ${err.message}`);
    });
  });
  app.listen(port, () => {
    console.log(`Worker ${process.pid} is listening on port ${port}`);
  });
  console.log(`Worker ${process.pid} is launch on port ${port}...`);
};

export default launchWorker;
