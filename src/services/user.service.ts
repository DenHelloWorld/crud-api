import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model.ts';

class UserService {
  private usersData: User[] = [
    {
      id: 'd7c944d8-049b-4bb1-b3c7-078d37d6380f',
      username: 'Denis',
      age: 30,
      hobbies: ['sleep'],
    },
  ];

  async getAllUsers(): Promise<User[]> {
    return this.usersData;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.usersData.find(user => user.id === id);
  }

  async createUser(username: string, age: number, hobbies: string[]): Promise<User> {
    const newUser: User = { id: uuidv4(), username, age, hobbies };
    this.usersData.push(newUser);
    return newUser;
  }

  async updateUser(id: string, username: string, age: number, hobbies: string[]): Promise<User | null> {
    const userIndex = this.usersData.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.usersData[userIndex] = { id, username, age, hobbies };
    return this.usersData[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.usersData.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.usersData.splice(userIndex, 1);
    return true;
  }
}

const userDb = new UserService();
export default userDb;
