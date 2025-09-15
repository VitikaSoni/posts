import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      password: process.env.REDIS_PASSWORD,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on("error", (error) => {
      console.error("Redis connection error:", error);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis successfully");
      this.isConnected = true;
    });

    this.client.on("ready", () => {
      console.log("Redis client ready");
      this.isConnected = true;
    });

    this.client.on("end", () => {
      console.log("Redis connection ended");
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error("Failed to disconnect from Redis:", error);
      throw error;
    }
  }

  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error("Redis client is not connected");
    }
  }

  // Write operations
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      this.ensureConnected();
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.ensureConnected();
      await this.client.del(key);
    } catch (error) {
      console.error(`Redis DELETE error for key ${key}:`, error);
      throw error;
    }
  }

  // Read operations
  async get(key: string): Promise<string | null> {
    try {
      this.ensureConnected();
      return await this.client.get(key);
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      this.ensureConnected();
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      this.ensureConnected();
      return await this.client.keys(pattern);
    } catch (error) {
      console.error(`Redis KEYS error for pattern ${pattern}:`, error);
      throw error;
    }
  }

  // Utility methods
  getClient(): RedisClientType {
    return this.client;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}

// Create and export a singleton instance
const redisService = new RedisService();

export default redisService;
export { RedisService };
