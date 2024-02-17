require("dotenv").config();
import mongoose from "mongoose";
import { startWork, startWorkEscrow } from "../database/wrappers/dataWrapper";

(async () => {
  try {
    mongoose.set("strictQuery", true);
    const url = process.env.MONGO_URL || "";
    await mongoose.connect(url);
    console.log("DB connected!!!");

    await Promise.all([startWorkEscrow(0), startWork(0)]);
  } catch (err) {
    console.log(err);
    
    // throw err;
  }
})();
