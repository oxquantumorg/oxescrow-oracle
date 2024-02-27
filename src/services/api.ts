import {
  fetchEscrows,
  getEscrowByAcc,
} from "../database/wrappers/escrowWrapper";
import { createEscrow } from "../libs/createEscrow";
import { releaseEscrow } from "../libs/releaseEscrow";
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 4001;

// exposes endpoint for creating escrow
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
  try {
    const publicKey = req.query.publicKey;
    const data = await fetchEscrows({ initializer_account_pubkey: publicKey });
    return res.send(data);
  } catch (error) {
    return res.send({
      isSuccess: false,
      message: error.message,
      data: null,
    });
  }
});

app.get("/releaseescrow", async (req, res) => {
  try {
    const publicKey = req.query.publicKey;
    const escrow = await getEscrowByAcc(publicKey);
    if (!escrow)
      return res.send({
        isSuccess: false,
        message: "escrow not found",
        data: null,
      });

    const data = await releaseEscrow(escrow);
    const { balAfter, balBefore, txHash } = data;

    return res.send({
      isSuccess: false,
      message: `Token has been released, old balance: ${balBefore} and new balance: ${balAfter} 
      Tx hash: ${txHash}`,
      data: data,
    });
  } catch (error) {
    return res.send({
      isSuccess: false,
      message: error.message,
      data: null,
    });
  }
});

app.listen(port, () => {
  console.log(`Escrow server listening on port ${port}`);
});
