require("./config/global");
// import { Connection } from "@solana/web3.js";
import { escrowIndex } from "./indexer";
const cron = require("node-cron");
// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

cron.schedule("*/10 * * * * *", () => {
  escrowIndex();
});
