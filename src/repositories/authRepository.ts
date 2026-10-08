import * as Crypto from 'expo-crypto';
import { DBClient } from '../database/client';
import { User } from '../types/domain';

interface UserRow extends User {
  password_hash: string;
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  createdAt: row.createdAt,
});

const hashPassword = (value: string): Promise<string> =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, value);

export class AuthRepository {
  constructor(private readonly db: DBClient) {}

  async signUp(email: string, password: string, name: string): Promise<User> {
    const existing = await this.db.first<{ id: number }>('SELECT id FROM users WHERE email = ?;', [email.toLowerCase()]);
    if (existing) {
      throw new Error('An account already exists with this email.');
    }

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);
    await this.db.run(
      'INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?);',
      [email.toLowerCase(), passwordHash, name, now],
    );

    const user = await this.db.first<UserRow>(
      'SELECT id, email, name, created_at as createdAt, password_hash FROM users WHERE email = ?;',
      [email.toLowerCase()],
    );

    if (!user) throw new Error('Failed to create account.');
    return mapUser(user);
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.db.first<UserRow>(
      'SELECT id, email, name, created_at as createdAt, password_hash FROM users WHERE email = ?;',
      [email.toLowerCase()],
    );

    if (!user) {
      throw new Error('No user found with this email.');
    }

    const inputHash = await hashPassword(password);
    if (inputHash !== user.password_hash) {
      throw new Error('Incorrect password.');
    }

    return mapUser(user);
  }

  async updateName(userId: number, name: string): Promise<void> {
    await this.db.run('UPDATE users SET name = ? WHERE id = ?;', [name, userId]);
  }

  async getById(userId: number): Promise<User | null> {
    const user = await this.db.first<UserRow>(
      'SELECT id, email, name, created_at as createdAt, password_hash FROM users WHERE id = ?;',
      [userId],
    );

    return user ? mapUser(user) : null;
  }
}
