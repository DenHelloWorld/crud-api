import { IncomingMessage, ServerResponse } from 'node:http';
import { UrlWithParsedQuery } from 'node:url';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../consrollers/user.controller';

export const userRoutes = (req: IncomingMessage, res: ServerResponse, parsedUrl: UrlWithParsedQuery) => {
  const { pathname } = parsedUrl;

  if (req.method === 'GET' && pathname === '/api/users') {
    getUsers(req, res);
    return;
  }

  if (req.method === 'GET' && pathname?.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];
    getUserById(req, res, userId);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/users') {
    createUser(req, res);
    return;
  }

  if (req.method === 'PUT' && pathname?.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];
    updateUser(req, res, userId);
    return;
  }

  if (req.method === 'DELETE' && pathname?.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];
    deleteUser(req, res, userId);
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Resource not found' }));
};
