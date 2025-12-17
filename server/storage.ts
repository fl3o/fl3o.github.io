import { type User, type InsertUser, type RatioEntry, type InsertRatioEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEntries(): Promise<RatioEntry[]>;
  getEntry(id: string): Promise<RatioEntry | undefined>;
  createEntry(entry: InsertRatioEntry): Promise<RatioEntry>;
  deleteEntry(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private entries: Map<string, RatioEntry>;

  constructor() {
    this.users = new Map();
    this.entries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllEntries(): Promise<RatioEntry[]> {
    return Array.from(this.entries.values());
  }

  async getEntry(id: string): Promise<RatioEntry | undefined> {
    return this.entries.get(id);
  }

  async createEntry(insertEntry: InsertRatioEntry): Promise<RatioEntry> {
    const id = randomUUID();
    const entry: RatioEntry = {
      ...insertEntry,
      id,
      recordedAt: new Date(),
    };
    this.entries.set(id, entry);
    return entry;
  }

  async deleteEntry(id: string): Promise<boolean> {
    return this.entries.delete(id);
  }
}

export const storage = new MemStorage();
