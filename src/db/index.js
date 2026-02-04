import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Check");
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("Db connection error", error);
    process.exit(1);
  }
};

export default connectDB;
