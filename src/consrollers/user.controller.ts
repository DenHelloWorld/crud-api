import { IncomingMessage, ServerResponse } from 'node:http';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import userDb from '../services/user.service';
import { User } from '../models/user.model';

export const getUsers = async (_req: IncomingMessage, res: ServerResponse) => {
  const users = await userDb.getAllUsers();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
};
export const getUserById = async (_req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!validateUuid(userId)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid user ID format' }));
    return;
  }
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
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'No data provided' }));
      return;
    }

    try {
      const parsedBody: User = JSON.parse(body);

      const { username, age, hobbies } = parsedBody;

      if (typeof username !== 'string' || !username.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: username is required and must be a non-empty string' }));
        return;
      }
      if (typeof age !== 'number' || age < 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: age is required and must be a non-negative number' }));
        return;
      }
      if (!Array.isArray(hobbies) || !hobbies.every(item => typeof item === 'string')) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: hobbies are required and must be an array of strings' }));
        return;
      }

      const newUser = await userDb.createUser(username, age, hobbies);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(newUser));
    } catch (error) {
      if (error instanceof SyntaxError) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid JSON format' }));
      } else {
        console.error('Error processing request:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Internal server error' }));
      }
    }
  });
};
export const updateUser = async (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!validateUuid(userId)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid userId format' }));
    return;
  }
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    // Check for empty body
    if (!body) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'No data provided' }));
      return;
    }

    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (typeof username !== 'string' || !username.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: username is required and must be a non-empty string' }));
        return;
      }
      if (typeof age !== 'number' || age < 0) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: age is required and must be a non-negative number' }));
        return;
      }
      if (!Array.isArray(hobbies)) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid data: hobbies are required and must be an array' }));
        return;
      }

      const updatedUser = await userDb.updateUser(userId, username, age, hobbies);
      if (!updatedUser) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(updatedUser));
    } catch (error) {
      if (error instanceof SyntaxError) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid JSON format' }));
      } else {
        console.error('Error processing request:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Internal server error' }));
      }
    }
  });
};
export const deleteUser = async (_req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!validateUuid(userId)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Invalid userId format' }));
    return;
  }

  const isDeleted = await userDb.deleteUser(userId);

  if (!isDeleted) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.statusCode = 204;
  res.end();
};
