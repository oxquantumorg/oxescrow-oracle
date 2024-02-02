require("dotenv").config()
import mongoose from "mongoose";
// const telegramBot = require("node-telegram-bot-api");
// export const useTelegramBot = new telegramBot(process.env.TGBOT_TOKEN);


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