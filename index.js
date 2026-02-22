import "dotenv/config";
import express from "express";
import cors from "cors";

import portfolioRoute from "./routes/portfolio.js";
import blogsRoute from "./routes/blogs.js";
import caseStudiesRoute from "./routes/case-studies.js";
import uploadsRoute from "./routes/uploads.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("SERVER RUNNING");
});

app.get("/api/test", (req, res) => {
  res.json({ status: "API running" });
});

app.get("/api/debug-env", (req, res) => {
  res.json({
    url: process.env.SUPABASE_URL || null,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "exists" : null,
    bucket: process.env.SUPABASE_BUCKET || null,
    nodeEnv: process.env.NODE_ENV || null
  });
});

app.use("/api/portfolio", portfolioRoute);
app.use("/api/blogs", blogsRoute);
app.use("/api/case-studies", caseStudiesRoute);
app.use("/api/uploads", uploadsRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER STARTED ON PORT", PORT);
});
