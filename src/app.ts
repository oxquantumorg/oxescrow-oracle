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
  const receiverPubKey = req.query.receiverPubKey;
  const senderPublicKey = req.query.senderPublicKey;
  const amount = req.query.amount;
  try {
    const escrowAcc = await createEscrow(amount, senderPublicKey, receiverPubKey);
    const message = `✨Escrow successfully initialized. 
    Expecting ${amount} Usdc deposit to the account ${escrowAcc}\n`;
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
  const data = await fetchEscrows({ sender_account_pubkey: publicKey });
  res.send(data);
});

app.listen(port, () => {
  console.log(`Escrow server listening on port ${port}`);
});
