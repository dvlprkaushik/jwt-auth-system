import dotenv from "dotenv";
dotenv.config();

// ✅ Required environment variables for app to run
const requiredEnvVars = [
  "DATABASE_URL",
  "ACCESS_SECRET",
  "REFRESH_SECRET",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}

export const env = {
  // 🌐 Server Config
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  baseUrl: process.env.BASE_URL || `http://localhost:${Number(process.env.PORT)}`,
  // 🧩 Database
  dbUrl: process.env.DATABASE_URL!,

  // 🔐 JWT Config
  accessSecret: process.env.ACCESS_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
  accessTokenExpiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m") as `${number}${"s" | "m" | "h" | "d"}` | number,
  refreshTokenExpiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d") as `${number}${"s" | "m" | "h" | "d"}` | number,

  // 🧂 Bcrypt
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
