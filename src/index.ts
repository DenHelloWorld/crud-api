import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes';
import { config } from 'dotenv';

config();

const PORT = Number(process.env.PORT) || 4000;

export const app = createServer((req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  userRoutes(req, res, parsedUrl);
});

if (PORT && process.env.MODE !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server ${process.pid} is listening on port ${PORT}`);
  });
}
