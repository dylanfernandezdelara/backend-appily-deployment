import mongoose from "mongoose";

const mongoUri =
  process.env.MONGO_URI ||
  "mongodb+srv://appily:BFDbqRJSSNF1a3kF@cluster0.crbki.mongodb.net/test?retryWrites=true&w=majority";

export const connectMongoose = async () => mongoose.connect(mongoUri);
export const disconnectMongoose = async () => mongoose.disconnect();
