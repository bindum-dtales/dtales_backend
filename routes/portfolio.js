import express from "express";
import { getSupabaseClient } from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(500).json({
        error: "Supabase not configured"
      });
    }

    const { data, error } = await supabase
      .from("portfolio")
      .select("*");

    if (error) {
      console.error("Portfolio query error:", error);
      return res.status(500).json({
        error: "Database error",
        details: error.message
      });
    }

    return res.json(data || []);

  } catch (err) {
    console.error("Portfolio route crash:", err);
    return res.status(500).json({
      error: "Portfolio route failed",
      details: err.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(500).json({ error: "Supabase not configured" });
    }

    const { title, link, category, cover_image_url } = req.body;

    const { data, error } = await supabase
      .from("portfolio")
      .insert([
        { title, link, category, cover_image_url }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: "Insert failed",
        details: error.message
      });
    }

    return res.status(201).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Portfolio create failed",
      details: err.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return res.status(500).json({ error: "Supabase not configured" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Missing ID parameter"
      });
    }

    const { data, error } = await supabase
      .from("portfolio")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio delete error:", error);
      return res.status(500).json({
        error: "Delete failed",
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: "Portfolio item not found"
      });
    }

    return res.json({
      success: true,
      message: "Portfolio item deleted successfully",
      deleted: data
    });

  } catch (err) {
    console.error("Portfolio delete route crash:", err);
    return res.status(500).json({
      error: "Portfolio delete failed",
      details: err.message
    });
  }
});

export default router;
