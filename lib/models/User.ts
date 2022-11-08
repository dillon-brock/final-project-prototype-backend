import { NewUserInfo, UserRow } from "../types/types";

const pool = require('../utils/pool');

export class User {
  id: string;
  email: string;
  #passwordHash: string;
  type: string;

  constructor(row: UserRow) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
    this.type = row.type;
  }

  static async insert({ email, passwordHash, type }: NewUserInfo): Promise<User> {
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password_hash, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [email, passwordHash, type]
    );

    return new User(rows[0]);
  }

  static async getByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query(
      `SELECT * FROM users
      WHERE email = $1`, [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  get passwordHash(): string {
    return this.#passwordHash;
  }

  async updateType(type: string): Promise<User> {
    const { rows } = await pool.query(
      `UPDATE users
      SET type = $1
      WHERE id = $2
      RETURNING *`,
      [type, this.id]
    );

    return new User(rows[0]);
  }
};
