import { createServer } from 'http';

const server = createServer((_, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js with TypeScript and Webpack!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
