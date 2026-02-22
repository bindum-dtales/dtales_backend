process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

import "dotenv/config";
import express from "express";
import cors from "cors";

async function startServer() {
  try {
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

    // Import routes inside try block to prevent startup crash
    const portfolioRoute = (await import("./routes/portfolio.js")).default;
    const blogsRoute = (await import("./routes/blogs.js")).default;
    const caseStudiesRoute = (await import("./routes/case-studies.js")).default;
    const uploadsRoute = (await import("./routes/uploads.js")).default;

    app.use("/api/portfolio", portfolioRoute);
    app.use("/api/blogs", blogsRoute);
    app.use("/api/case-studies", caseStudiesRoute);
    app.use("/api/uploads", uploadsRoute);

    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    app.use((err, req, res, next) => {
      console.error("GLOBAL ERROR:", err);
      res.status(500).json({
        error: "Internal server error",
        message: err.message
      });
    });

    app.listen(PORT, () => {
      console.log(`Server started successfully on port ${PORT}`);
    });

  } catch (err) {
    console.error("SERVER FAILED TO START:", err);
    process.exit(1);
  }
}

startServer();
