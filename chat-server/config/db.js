import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB 연결 에러:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB 연결이 끊어졌습니다.");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
