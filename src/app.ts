require("./config/global");
import { getEscrows } from "./database/wrappers/escrowWrapper";
// import { Connection } from "@solana/web3.js";
import { escrowIndex, syncIndex } from "./indexer";
const cron = require("node-cron");
const express = require("express");
const cors = require('cors')

const app = express();
app.use(cors())
const port = 3004;

// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

cron.schedule("*/10 * * * * *", () => {
  syncIndex();
});

// cron.schedule("*/10 * * * * *", () => {
//   // escrowIndex();
// });

app.get("/", async (req, res) => {
  res.send({ data: "data" });
});

app.get("/getescrows", async (req, res) => {
  const publicKey = req.query.publicKey;
  const data = await getEscrows({ sender_account_pubkey: publicKey });
  res.send(data);
});

app.listen(port, () => {
  console.log(`Escrow server listening on port ${port}`);
});
