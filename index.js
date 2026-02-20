import express from "express";
import cors from "cors";

let app;

try {
  app = express();

  app.use(cors());
  app.use(express.json());

  // Safe test route
  app.get("/api/test", (req, res) => {
    res.json({
      status: "API working",
      timestamp: new Date().toISOString()
    });
  });

  // Import routes inside try block
  try {
    const blogsRoute = (await import("./routes/blogs.js")).default;
    const caseStudiesRoute = (await import("./routes/case-studies.js")).default;
    const portfolioRoute = (await import("./routes/portfolio.js")).default;

    app.use("/api/blogs", blogsRoute);
    app.use("/api/case-studies", caseStudiesRoute);
    app.use("/api/portfolio", portfolioRoute);
  } catch (routeError) {
    console.error("Route loading error:", routeError);
  }

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

} catch (startupError) {
  console.error("CRITICAL STARTUP ERROR:", startupError);
}
