import express from "express";
import { getSupabaseClient } from "../config/supabase.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(500).json({
        error: "Supabase not configured"
      });
    }

    const response = await supabase
      .from("portfolio")
      .select("*");

    if (!response) {
      return res.json([]);
    }

    if (response.error) {
      console.error("Portfolio query error:", response.error);
      return res.status(500).json({
        error: "Database error",
        details: response.error.message
      });
    }

    return res.json(response.data || []);

  } catch (err) {
    console.error("Portfolio route crash:", err);
    return res.status(500).json({
      error: "Portfolio route failed",
      details: err.message
    });
  }
});

export default router;
