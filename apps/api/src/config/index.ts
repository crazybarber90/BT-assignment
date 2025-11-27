// Environment configuration service
// No hardcoded values - everything comes from environment variables

interface DatabaseConfig {
  url: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

interface ServerConfig {
  port: number;
  host: string;
  environment: string;
}

interface Config {
  database: DatabaseConfig;
  server: ServerConfig;
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

function getOptionalEnv(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] || defaultValue;
}

function getRequiredEnvNumber(key: string): number {
  const value = getRequiredEnv(key);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
}

function getOptionalEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
}

export const config: Config = {
  database: {
    url: getRequiredEnv("DATABASE_URL"),
    host: getOptionalEnv("DB_HOST", undefined),
    port: getOptionalEnvNumber("DB_PORT", 5432),
    database: getOptionalEnv("DATABASE_NAME", undefined),
    username: getOptionalEnv("DATABASE_USER", undefined),
    password: getOptionalEnv("DATABASE_PASSWORD", undefined),
  },
  server: {
    port: getOptionalEnvNumber("PORT", 3003),
    host: getOptionalEnv("HOST", "0.0.0.0") || "0.0.0.0",
    environment: getRequiredEnv("NODE_ENV"),
  },
};

// Type exports for use in other modules
export type { DatabaseConfig, ServerConfig, Config };
