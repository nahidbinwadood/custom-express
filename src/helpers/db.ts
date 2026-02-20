import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'users.json');

export const getUsers = async () => {
  try {
    const users = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(users);
  } catch (error) {
    throw new Error(
      `Failed to get user data . Error:${(error as Error)?.message}`
    );
  }
};

export const writeUsers = async (users: any[]) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write user data . Error:${(error as Error)?.message}`
    );
  }
};
