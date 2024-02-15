import { Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
const BufferLayout = require("buffer-layout");

export const logError = (msg: string) => {
  console.log(`\x1b[31m${msg}\x1b[0m`);
};

const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const getAdminAcc = () => {
  return new Keypair({
    publicKey: new PublicKey(
      JSON.parse(fs.readFileSync(`./admin.pub.json`) as unknown as string)
    ).toBytes(),
    secretKey: Uint8Array.from(
      JSON.parse(fs.readFileSync(`./admin.key.json`) as unknown as string)
    ),
  });
};

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("initializerPubkey"),
  publicKey("receiverAccountPubkey"),
  publicKey("initializerTempTokenAccountPubkey"),
  uint64("expectedAmount"),
  uint64("expireDate"),
]);

export interface EscrowLayout {
  isInitialized: number;
  initializerPubkey: Uint8Array;
  receiverAccountPubkey: Uint8Array;
  initializerTempTokenAccountPubkey: Uint8Array;
  expectedAmount: Uint8Array;
  expireDate: Uint8Array;
}
