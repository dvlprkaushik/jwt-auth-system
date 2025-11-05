import express, { Request, Response } from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import pkg from "package.json";
import { env } from "./env/env";

dotenv.config({quiet : true});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Test Routes
app.get("/", (_req: Request, res: Response) => {
  return res.json({ success: true, message: "Server is running 🚀" });
});
app.get("/info", (_req: Request, res: Response) => {
  const { name, version, description, author } = pkg;
  return res.json({
    name,
    version,
    description,
    author,
  });
});

// Fallback route
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(
    chalk.green.bold(`✅ Server running at ${env.baseUrl}`)
  );
  console.log(chalk.blue(`Mode: ${env.nodeEnv}`));
});
