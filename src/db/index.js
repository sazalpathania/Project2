import mongoose from "mongoose";

const connectDB = async () => {
  console.log("check");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("URI", process.env.MONGO_URI);
    console.log("Db connected");
  } catch (error) {
    console.log("Db connection error", error);
    process.exit(1);
  }
};

export default connectDB;
