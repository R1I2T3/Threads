import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/threads`
    );
    console.log(
      `\nMongodb connected DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongodb connection error: " + error);
    process.exit(1);
  }
};

export default connectDB;
