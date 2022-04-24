import mongoose from "mongoose";

const mongoUri =
  process.env.MONGO_URI;

export const connectMongoose = async () => mongoose.connect(mongoUri);
export const disconnectMongoose = async () => mongoose.disconnect();
