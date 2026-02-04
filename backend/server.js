import express from "express";
import path from "path";
import helmet from "helmet"; // Security headers
import rateLimit from "express-rate-limit"; // Prevents DDoS
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

// 1. CONNECT DATABASE
connectMongoDB(DB).then(() => console.log("MongoDB Connected Successfully"));

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

app.listen(PORT, () => console.log(`Server Started at Port:${PORT}`));
