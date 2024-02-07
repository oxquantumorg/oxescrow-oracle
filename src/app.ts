require("./config/global");
import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js";
import { getData, updateData } from "./database/wrappers/dataWrapper";
import bs58 from "bs58";
import config from "./config";
import {
  getEscrowByPubKey,
  saveEscrow,
  updateEscrow,
} from "./database/wrappers/escrowWrapper";
const cron = require("node-cron");
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// cron.schedule("*/10 * * * * *", () => {
//   console.log("running a task every minute");
// });

(async () => {
  try {
    /** - Check database for existing transactions
     *  - Get the last block hash
     *  - Start logging for new transactions (pass the transaction hash to the log function (if transactions exists)
     *  - On getting new transactions, decode the data and store them to database
     */

    const data = await getData();
    if (!data || !data.last_block_hash) {
      console.log("no data");
      return;
    }

    const lastBlockHash: string = data.last_block_hash;
    const escrowProgramPubkey = config.escrowProgramPubkey;
    const options = { limit: 10, until: lastBlockHash };
    const blocks = await connection.getConfirmedSignaturesForAddress2(
      escrowProgramPubkey,
      options
    );

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockHash = block.signature;
      const res = await connection.getParsedTransaction(blockHash);
      const txs = res.transaction.message.instructions;
      
      for (let j = 0; j < txs.length; j++) {
        const tx = txs[j];
        if (tx.programId.equals(escrowProgramPubkey)) {
          console.log("---");
          console.log("lastBlockHash", lastBlockHash);
          console.log("---");
          console.log("blockHash", blockHash);
          const txIX: any = tx as ParsedInstruction;
          const accounts = txIX.accounts;
          const escrowPubKey: string = accounts[3].toString();
          const txData = txIX.data;
          const dataAsUint8Arr = bs58.decode(txData);
          const call = dataAsUint8Arr[0];
          const amount = dataAsUint8Arr[1];
          const mint = config.mint.toString();

          const storeData = {
            input_tx_hash: "",
            payout_tx_hash: "",
            token_pubkey: mint,
            sender_account_pubkey: "",
            temp_token_account_pubkey: "",
            receiver_account_pubkey: "",
            receiver_token_account_pubkey: "",
            escrow_account_pubkey: "",
            escrow_amount: amount,
            expire_date: block.blockTime + 300,
            completed: call,
            index: data.escrow_count,
          };

          const escrow = await getEscrowByPubKey(escrowPubKey);
          if (!escrow && call === 0) {
            storeData.input_tx_hash = blockHash;
            storeData.sender_account_pubkey = accounts[0].toString();
            storeData.receiver_account_pubkey = accounts[1].toString();
            storeData.temp_token_account_pubkey = accounts[2].toString();
            storeData.escrow_account_pubkey = escrowPubKey;
            await saveEscrow(storeData);
          }

          if (escrow && call === 1) {
            const updateEscrowData: any = {};
            updateEscrowData.receiver_token_account_pubkey =
              accounts[1].toString();
            updateEscrowData.completed = 1;
            updateEscrowData.payout_tx_hash = blockHash;
            await updateEscrow(escrowPubKey, updateEscrowData);
            console.log("Escrow Completed");
            console.log("---");
          }

          const updateData_: any = {
            escrow_count: data.escrow_count,
          };
          updateData_.escrow_count += 1;
          updateData_.last_block_hash = blockHash;
          await updateData(updateData_);
          console.log("call", call);
          console.log("amount", amount);
          console.log("escrowPubKey", escrowPubKey);

          console.log("End.....");
        }
      }
    }
    console.log("Completed");
  } catch (error) {
    console.log(error);
  }
})();
