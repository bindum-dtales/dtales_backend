import "dotenv/config";

console.log("ENV CHECK:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING");
console.log("SUPABASE_BUCKET:", process.env.SUPABASE_BUCKET);
console.log("NODE_ENV:", process.env.NODE_ENV);

console.log("INDEX FILE LOADED");

import express from "express";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

// Test route
app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

// Health check
app.get("/api/test", (req, res) => {
  res.json({ status: "API running" });
});

// SAFE ROUTE LOADING
async function loadRoutes() {
  try {
    const portfolioRoute = (await import("./routes/portfolio.js")).default;
    const blogsRoute = (await import("./routes/blogs.js")).default;
    const caseStudiesRoute = (await import("./routes/case-studies.js")).default;
    const uploadsRoute = (await import("./routes/uploads.js")).default;

    app.use("/api/portfolio", portfolioRoute);
    app.use("/api/blogs", blogsRoute);
    app.use("/api/case-studies", caseStudiesRoute);
    app.use("/api/uploads", uploadsRoute);

    console.log("✓ All routes mounted successfully");

  } catch (err) {
    console.error("Route loading failed:", err);
  }
}

loadRoutes();

// Debug environment variables
app.get("/api/debug-env", (req, res) => {
  console.log("DEBUG: Checking environment variables...");
  console.log("DEBUG: SUPABASE_URL =", process.env.SUPABASE_URL ? "loaded" : "missing");
  console.log("DEBUG: SUPABASE_SERVICE_ROLE_KEY =", process.env.SUPABASE_SERVICE_ROLE_KEY ? "loaded" : "missing");
  console.log("DEBUG: SUPABASE_BUCKET =", process.env.SUPABASE_BUCKET || "missing");
  
  res.json({
    url: process.env.SUPABASE_URL || null,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "exists" : null,
    bucket: process.env.SUPABASE_BUCKET || null,
    nodeEnv: process.env.NODE_ENV || null
  });
});

// Network connectivity test
app.get("/network-test", async (req, res) => {
  try {
    const response = await fetch("https://google.com");
    res.json({ status: "success", httpStatus: response.status });
  } catch (err) {
    res.json({ error: err.message, cause: err.cause?.code });
  }
});

// Supabase connectivity test
app.get("/supabase-test", async (req, res) => {
  try {
    const response = await fetch(
      process.env.SUPABASE_URL + "/rest/v1/",
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }
    );
    res.json({ status: response.status, ok: response.ok });
  } catch (err) {
    res.json({ error: err.message, cause: err.cause?.code });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
