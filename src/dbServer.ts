import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes.ts';

const DB_PORT = Number(process.env.DB_PORT) || 3999;

const app = createServer((req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  userRoutes(req, res, parsedUrl);
});

app.listen(DB_PORT, () => {
  console.log(`DB Server ${process.pid} is listening on port ${DB_PORT}`);
});
