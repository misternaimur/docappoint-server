/** @format */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URL;

if (!uri) {
  throw new Error("MONGO_URL is not defined");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! i am naimur");
});

let doctorsCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db("DocAppointdb");
    doctorsCollection = db.collection("Doctors-db");

    app.get("/doctors", async (req, res) => {
      try {
        const result = await doctorsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch doctors" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully");

    app.use((req, res) => {
      res.status(404).json({
        message: "Route not found",
      });
    });

    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

run();

export default app;
