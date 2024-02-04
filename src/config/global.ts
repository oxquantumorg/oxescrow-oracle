require("dotenv").config()
import mongoose from "mongoose";

(async () => {
    try {
        mongoose.set("strictQuery", true);
        const url = process.env.MONGO_URL || ""
        await mongoose.connect(url);
        console.log("database connected successfully");
    } catch (err) {
        throw err;
    }
})();