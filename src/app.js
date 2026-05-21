/** @format */

import express from "express";
import cors from "cors";
import { getDoctorsCollection } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DocAppoint backend running",
    status: "ok",
  });
});

app.get("/doctors", async (req, res) => {
  try {
    const doctorsCollection = await getDoctorsCollection();
    const result = await doctorsCollection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error("/doctors failed:", error);
    res.status(500).json({
      message: "Failed to fetch doctors",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
