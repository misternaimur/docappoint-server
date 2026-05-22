/** @format */

import express from "express";
import cors from "cors";
import {
  getDoctorsCollection,
  pingMongo,
  getBookingsCollection,
} from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    await pingMongo();
    res
      .type("html")
      .send(
        "<h1>DocAppoint backend running</h1><p>MongoDB connected successfully.</p>",
      );
  } catch (error) {
    console.error("Mongo ping failed:", error);
    res
      .status(500)
      .type("html")
      .send(
        "<h1>DocAppoint backend running</h1><p>MongoDB connection failed.</p>",
      );
  }
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

// get bookings for a user (by userId or by email)
app.get("/bookings/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookingsCollection = await getBookingsCollection();
    const query = userId.includes("@") ? { userEmail: userId } : { userId };
    const result = await bookingsCollection.find(query).toArray();
    res.json(result);
  } catch (error) {
    console.error("/bookings/user/:userId failed:", error);
    res.status(500).json({
      message: "Failed to fetch bookings for user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// edit a booking by booking_id
app.put("/bookings/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body || {};
    const bookingsCollection = await getBookingsCollection();

    const allowedFields = [
      "userId",
      "userEmail",
      "doctorName",
      "patientName",
      "gender",
      "phone",
      "appointmentDate",
      "appointmentTime",
    ];

    const updateDoc = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateDoc[field] = updates[field];
      }
    }

    updateDoc.updatedAt = new Date();

    const result = await bookingsCollection.findOneAndUpdate(
      { _id: bookingId },
      { $set: updateDoc },
      { returnDocument: "after" },
    );

    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated", data: result });
  } catch (error) {
    console.error("/bookings/:bookingId update failed:", error);
    res.status(500).json({
      message: "Failed to update booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// delete a booking by booking_id
app.delete("/bookings/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingsCollection = await getBookingsCollection();
    const result = await bookingsCollection.findOneAndDelete({
      _id: bookingId,
    });

    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted", data: result });
  } catch (error) {
    console.error("/bookings/:bookingId delete failed:", error);
    res.status(500).json({
      message: "Failed to delete booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a booking (accepts fields matching existing DB)
app.post("/bookings", async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      doctorName,
      patientName,
      gender,
      phone,
      appointmentDate,
      appointmentTime,
    } = req.body || {};

    if (
      !userEmail ||
      !doctorName ||
      !patientName ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bookings = await getBookingsCollection();
    const now = new Date();
    const doc = {
      userId: userId || null,
      userEmail,
      doctorName,
      patientName,
      gender: gender || null,
      phone: phone || null,
      appointmentDate,
      appointmentTime,
      createdAt: now,
      updatedAt: now,
    };

    const result = await bookings.insertOne(doc);
    res.status(201).json({ message: "Booking created", id: result.insertedId });
  } catch (error) {
    console.error("/bookings failed:", error);
    res.status(500).json({
      message: "Failed to create booking",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// List bookings (basic)
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await getBookingsCollection();
    const result = await bookings.find().sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    console.error("/bookings failed:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
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
