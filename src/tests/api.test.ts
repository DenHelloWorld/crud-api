import request from 'supertest';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import { app } from '..';
import { Server } from 'http';

describe('API Tests', () => {
  let userId: string;
  const PORT = 4000;
  let server: Server;
  const mockUser = {
    username: 'testuser',
    age: 30,
    hobbies: ['reading', 'gaming'],
  };

  beforeAll(done => {
    server = app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      done();
    });
  });

  afterAll(done => {
    server.close(done);
  });

  describe('POST /api/users', () => {
    it('should create a new user and respond with status 201', async () => {
      const response = await request(app).post('/api/users').send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      userId = response.body.id;
    });

    it('should respond with status 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ hobbies: ['reading'] });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid data: username is required and must be a non-empty string');
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return the user if exists', async () => {
      const response = await request(app).get(`/api/users/${userId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', mockUser.username);
    });

    it('should respond with status 400 if uuid invalid', async () => {
      const response = await request(app).get('/api/users/nonexistentId');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID format');
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should update the user and respond with status 200', async () => {
      const updatedUser = { username: 'updateduser', age: 31, hobbies: ['sports'] };

      const response = await request(app).put(`/api/users/${userId}`).send(updatedUser);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', updatedUser.username);
    });

    it('should respond with status 404 if user does not exist', async () => {
      const updatedUser = { username: 'updateduser', age: 31, hobbies: ['sports'] };

      const response = await request(app).put('/api/users/d7c944d8-049b-4bb1-b3c7-078d37d6380d').send(updatedUser);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should respond with status 400 if userId is invalid', async () => {
      const updatedUser = { username: 'updateduser', age: 31, hobbies: ['sports'] };

      const response = await request(app).put('/api/users/invalidId').send(updatedUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid userId format');
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete the user and respond with status 204', async () => {
      const response = await request(app).delete(`/api/users/${userId}`);

      expect(response.status).toBe(204);
    });

    it('should respond with status 404 if user does not exist', async () => {
      const response = await request(app).delete('/api/users/d7c944d8-049b-4bb1-b3c7-078d37d6380d');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should respond with status 400 if userId is invalid', async () => {
      const response = await request(app).delete('/api/users/invalidId');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid userId format');
    });
  });
});
