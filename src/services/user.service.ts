import { readFile, writeFile } from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.model.ts';


const usersPath = './src/db/users.json';
class UserService {
  private async readUsers(): Promise<User[]> {
    try {
      const data = await readFile(usersPath, 'utf-8');
      return JSON.parse(data) as User[];
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  private async writeUsersData(users: User[]): Promise<void> {
    try {
      await writeFile(usersPath, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.readUsers();
  }

  async getUserById(id: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  }

  async createUser(username: string, age: number, hobbies: string[]): Promise<User> {
    const users = await this.readUsers();
    const newUser: User = { id: uuidv4(), username, age, hobbies };
    users.push(newUser);
    await this.writeUsersData(users);
    return newUser;
  }

  async updateUser(id: string, username: string, age: number, hobbies: string[]): Promise<User | null> {
    const users = await this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = { id, username, age, hobbies };
    await this.writeUsersData(users);
    return users[userIndex];
  }

  async deleteUser(id: string): Promise<boolean> {
    const users = await this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    await this.writeUsersData(users);
    return true;
  }
}

const userDb = new UserService();
export default userDb;
