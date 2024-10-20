import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes.ts';

export const DB_PORT = Number(process.env.DB_PORT) || 3500;

const launchDb = async (port: number) => {
  const app = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    userRoutes(req, res, parsedUrl);
  });

  app.listen(port, () => {
    console.log(`DB Server ${process.pid} is listening on port ${port}`);
  });
};

export default launchDb;
