// Global imports
import hpp from "hpp";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import dotnev from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import contextService from "request-context";
import mongoSanitize from "express-mongo-sanitize";

// Project Imports
import log from "utils/Logger";
import { connect } from "config/Database";
import ErrorHandler from "utils/ErrorHandler";
import ErrorMiddleware from "middleware/ErrorMiddleware";
import { deserializeUser } from "middleware/DeserializeUser";

// Import Router
import v1Router from "routes/index";

// Config dotenv
dotnev.config({ path: "./.env" });

// CONSTANTS
const port = process.env.PORT;
const host = process.env.HOST;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in 15 minutes !",
});

// Handle Uncaught Exception
process.on("uncaughtException", (err) => {
  log.error("UNCAUGHT EXCEPTION 🔥. SHUTTING DOWN");
  log.error(err.name, err.message);
  process.exit(1);
});

// Initialize app
const app = express();

// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src/views"));

// Middleware
app.use(express.static(path.join(__dirname, "src/public")));
app.use(limiter);
app.use(hpp());
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(deserializeUser);
app.use(contextService.middleware("request"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set Request Context
app.all("*", (req, res, next) => {
  contextService.set("request.req", req);

  next();
});

// Register Routes
app.use("/api/v1", v1Router);

// Handle Unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`PAGE NOT FOUND`, 404));
});

// Register Global Error Handling Middleware
app.use(ErrorMiddleware);

// Start the server
const server = app.listen(port, host, () => {
  log.info(`Server started at 'http://${host}:${port}'`);

  connect();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    log.error(`ERROR: ${error.stack}`);
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    log.error(`Error: ${error.message}`);
  }

  log.warn("Shutting down the server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});
