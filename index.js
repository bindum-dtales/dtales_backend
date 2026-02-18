import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import blogsRouter from "./routes/blogs.js";
import caseStudiesRouter from "./routes/case-studies.js";
import uploadsRouter from "./routes/uploads.js";

const app = express();

// CORS middleware - enable for all routes
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

// Body parsing middleware
// CRITICAL: 10mb limit to handle large HTML content with embedded images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root health check
app.get("/", (_req, res) => {
  res.send("DTALES API Running");
});

// CRITICAL: Mount upload routes BEFORE express.json() would interfere
// Multer handles multipart/form-data parsing internally
// Uploads route mounted at /api/uploads
app.use("/api/uploads", uploadsRouter);

// API Routes
app.use("/api/blogs", blogsRouter);
app.use("/api/case-studies", caseStudiesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
