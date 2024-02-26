require("./config/global");
import {
  fetchEscrows,
  getEscrowByPubKey,
} from "./database/wrappers/escrowWrapper";
import { escrowIndex, releaseEscrowIndex, syncIndex } from "./indexer";
import { createEscrow } from "./libs/createEscrow";
import { releaseEscrow } from "./libs/releaseEscrow";
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

cron.schedule("*/10 * * * * *", () => {
  releaseEscrowIndex();
});

// Exposes endpoint for creating escrow
app.get("/create_escrow", async (req, res) => {
  const receiverPubKey = req.query.receiverPubKey;
  const senderPublicKey = req.query.senderPublicKey;
  const amount = req.query.amount;
  try {
    const escrowAcc = await createEscrow(
      amount,
      senderPublicKey,
      receiverPubKey
    );
    const message = `Escrow successfully initialized. 
    Expecting ${amount} token deposit to the account ${escrowAcc}\n`;
    return res.send({
      isSuccess: true,
      message,
      data: {
        amount,
        escrowAcc,
      },
    });
  } catch (error) {
    return res.send({
      isSuccess: false,
      message: error.message,
      data: null,
    });
  }
});

app.get("/", async (req, res) => {
  res.send({ data: "data" });
});

app.get("/getescrows", async (req, res) => {
  const publicKey = req.query.publicKey;
  const data = await fetchEscrows({ initializer_account_pubkey: publicKey });
  res.send(data);
});

app.get("/releaseescrow", async (req, res) => {
  const publicKey = req.query.publicKey;
  const escrow = await getEscrowByPubKey(publicKey);
  if (!escrow) return res.send({ message: "escrow not found" });
  const data = await releaseEscrow(escrow);
  res.send(data);
});

app.listen(port, () => {
  console.log(`Escrow server listening on port ${port}`);
});
