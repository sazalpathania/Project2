import { config } from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
config();

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Db connected on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDb connection failed !!!`, err);
  });
