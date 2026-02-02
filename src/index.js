import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./db/index.js";
config();

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());

await connectDB();

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
