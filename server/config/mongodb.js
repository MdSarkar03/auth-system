import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected"),
    );
    mongoose.connection.on("error", (err) => {
      console.error("DB error:", err);
      process.exit(1);
    });

    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
