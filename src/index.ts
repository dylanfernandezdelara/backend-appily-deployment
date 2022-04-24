const path = require("path");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, "../.env") });
}
import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 4000;
const mongoUri =
  process.env.MONGO_URI ||
  "mongodb+srv://appily:BFDbqRJSSNF1a3kF@cluster0.crbki.mongodb.net/test?retryWrites=true&w=majority";

const startApp = async () => {
  try {
    await mongoose.connect(mongoUri);
    app.listen(port, () => {
      console.log(`Server is ready at: localhost:${port} 🐶`);
    });
  } catch (e) {
    console.error(`Failed to start app with error 💣: ${e}`);
  }
};

startApp();