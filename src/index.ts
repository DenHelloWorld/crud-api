
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { parse } from 'node:url';
import { userRoutes } from './routes/user.routes';

const PORT = Number(process.env.PORT) || 4000;

const app = createServer((req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  userRoutes(req, res, parsedUrl);
});

app.listen(PORT, () => {
  console.log(`Server ${process.pid} is listening on port ${PORT}`);
});
