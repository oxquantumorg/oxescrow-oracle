require("dotenv").config();
import { Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
const BufferLayout = require("buffer-layout");

export const logError = (msg) => {
  try {
    const todayErrorFile = `logs/${new Date(Date.now())
      .toDateString()
      .replace(/ /gi, "-")}.log`;
    fs.appendFileSync(
      todayErrorFile,
      new Date(Date.now()).toTimeString() + " \n"
    );
    fs.appendFileSync(todayErrorFile, msg.toString());
    fs.appendFileSync(todayErrorFile, "\n \n");
    console.log(`\x1b[31m${msg}\x1b[0m`);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
};

const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const getAdminAcc = () => {
  return new Keypair({
    publicKey: new PublicKey(process.env.ORACLE_PUB_KEY).toBytes(),
    secretKey: Uint8Array.from(JSON.parse(process.env.ORACLE_PRIV_KEY)),
  });
};

export const getTokenBalance = async (pubkey: PublicKey, connection) => {
  return parseInt(
    (await connection.getTokenAccountBalance(pubkey)).value.amount
  );
};

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("callerPubkey"),
  publicKey("initializerPubkey"),
  publicKey("receiverAccountPubkey"),
  publicKey("initializerTempTokenAccountPubkey"),
  uint64("expectedAmount"),
  uint64("expireDate"),
]);

export interface EscrowLayout {
  isInitialized: number;
  callerPubkey: Uint8Array;
  initializerPubkey: Uint8Array;
  receiverAccountPubkey: Uint8Array;
  initializerTempTokenAccountPubkey: Uint8Array;
  expectedAmount: Uint8Array;
  expireDate: Uint8Array;
}
