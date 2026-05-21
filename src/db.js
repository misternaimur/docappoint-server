/** @format */

import { MongoClient, ServerApiVersion } from "mongodb";

let clientPromise;

function createClientPromise() {
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

  return client.connect();
}

export async function getDoctorsCollection() {
  if (!clientPromise) {
    clientPromise =
      globalThis.__docAppointMongoClientPromise ?? createClientPromise();
    globalThis.__docAppointMongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  const db = client.db("DocAppointdb");
  return db.collection("Doctors-db");
}
