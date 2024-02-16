require("dotenv").config();
import mongoose from "mongoose";
import { startWork, startWorkEscrow } from "../database/wrappers/dataWrapper";

(async () => {
  try {
    mongoose.set("strictQuery", true);
    const url = process.env.MONGO_URL || "";
    console.log('url', url);
    console.log(process.env.MONGO_URL);
    console.log(process.env.ORACLE_PUB_KEY);
    
    await mongoose.connect(url);
    console.log("database connected successfully");

    await Promise.all([startWorkEscrow(0), startWork(0)]);
  } catch (err) {
    console.log(err);
    
    // throw err;
  }
})();
