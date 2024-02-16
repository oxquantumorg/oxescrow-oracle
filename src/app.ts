require("./config/global");
import { fetchEscrows } from "./database/wrappers/escrowWrapper";
import { escrowIndex, syncIndex } from "./indexer";
import { createEscrow } from "./libs/createEscrow";
const cron = require("node-cron");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 4001;

cron.schedule("*/10 * * * * *", () => {
  syncIndex();
});

cron.schedule("*/10 * * * * *", () => {
  escrowIndex();
});

app.get("/create_escrow", async (req, res) => {
  const amount = 0;
  const receiverAcc = "EHtmN2mYQsaUXgu59kLRNCLsPLpi4rsnFPGHSjJLsTEg";
  const data = await createEscrow(amount, receiverAcc);
  console.log(data);
  res.send({ data });
});

app.get("/", async (req, res) => {
  res.send({ data: "data" });
});

app.get("/getescrows", async (req, res) => {
  const publicKey = req.query.publicKey;
  const data = await fetchEscrows({ sender_account_pubkey: publicKey });
  res.send(data);
});

app.listen(port, () => {
  console.log(`Escrow server listening on port ${port}`);
});