import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import 'dotenv/config';
import { userRoutes } from './routes/user.routes.ts';

export const app = createServer((req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);

  userRoutes(req, res, parsedUrl);
});
