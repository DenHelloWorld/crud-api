import { IncomingMessage, ServerResponse } from 'node:http';
import userDb from '../services/user.service.ts';

export const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  const users = await userDb.getAllUsers();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
};
export const getUserById = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  const user = await userDb.getUserById(userId);
  if (!user) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(user));
};
export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    if (!body) {
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'No data provided' }));
      return;
    }

    try {
      const { username, age, hobbies } = JSON.parse(body);
      if (!username || !age || !Array.isArray(hobbies)) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid data' }));
        return;
      }

      const newUser = await userDb.createUser(username, age, hobbies);
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    } catch (error) {
      console.error('Error processing request:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  });
};
export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const { username, age, hobbies } = JSON.parse(body);
    const updatedUser = await userDb.updateUser(userId, username, age, hobbies);
    if (!updatedUser) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(updatedUser));
  });
};
export const deleteUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  const isDeleted = await userDb.deleteUser(userId);
  if (!isDeleted) {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }
  res.statusCode = 204;
  res.end();
};
