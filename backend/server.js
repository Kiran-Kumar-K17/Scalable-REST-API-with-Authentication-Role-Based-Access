import express from "express";
import path from "path";
import fs from "fs";
import helmet from "helmet"; // Security headers
import rateLimit from "express-rate-limit"; // Prevents DDoS
import morgan from "morgan"; // HTTP request logger
import { connectMongoDB } from "./MyDB.js";
import postRoute from "./routes/post.js";
import userRoute from "./routes/user.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
const PORT = process.env.PORT || 8000;
const DB = process.env.DATABASE_URL;

// Create a write stream for logging to file
const logStream = fs.createWriteStream(
  path.join(process.cwd(), "server_logs.txt"),
  { flags: "a" },
);

// Custom log format with timestamp
const logFormat = (tokens, req, res) => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  return `[${timestamp}] ${tokens.method(req, res)} ${tokens.url(req, res)} - ${tokens.status(req, res)} (${tokens["response-time"](req, res)}ms)`;
};

// 1. CONNECT DATABASE
connectMongoDB(DB).then(() => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const logMsg = `[${timestamp}] INFO: MongoDB Connected Successfully\n`;
  console.log("MongoDB Connected Successfully");
  logStream.write(logMsg);
});

// 2. GLOBAL MIDDLEWARES (Security & Parsing)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Rate Limiter: 100 requests per hour per IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use(limiter);

app.use(express.json({ limit: "10kb" })); // Prevents large payload attacks
app.use(express.static(path.join(process.cwd(), "public"))); // Serve images

// HTTP Request Logging - to console and file
app.use(morgan(logFormat));
app.use(morgan(logFormat, { stream: logStream }));

// 3. ROUTES
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/users", userRoute);

// 4. FALLBACK ROUTE (Handle 404)
app.all("*all", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// 5. GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const startMsg = `[${timestamp}] INFO: Server Started at Port: ${PORT}\n`;
  console.log(`Server Started at Port:${PORT}`);
  logStream.write(
    `[${timestamp}] INFO: [nodemon] starting \`node server.js\`\n`,
  );
  logStream.write(startMsg);
});
