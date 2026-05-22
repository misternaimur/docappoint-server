/** @format */

import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const port = process.env.PORT || 8080;
const bookingCollection = db.collection("booking")
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

app.post("/booking", async (req, res)=>{
  const bookingData = req.Data;
  const result = await bookingCollection.insertOne(bookingData)

  res.json(result);
})

export default app;
