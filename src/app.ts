require("./config/global");
import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js";
import { getData } from "./database/wrappers/dataWrapper";
import bs58 from "bs58";
import config from "./config";
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
    let lastBlockHash: string | null = data ? data.last_block_hash : null;
    const escrowProgramPubkey = config.escrowProgramPubkey;
    const options = { limit: 5, until: lastBlockHash };
    const blocks = await connection.getConfirmedSignaturesForAddress2(
      escrowProgramPubkey,
      options
    );

    blocks.forEach(async (block) => {
      const hash = block.signature;
      const res = await connection.getParsedTransaction(hash);
      const txs = res.transaction.message.instructions;
      txs.forEach(async (tx) => {
        if (tx.programId.equals(escrowProgramPubkey)) {
          const txIX: any = tx as ParsedInstruction;
          const escrowPubKey = JSON.stringify(txIX.accounts[3]);
          const data = txIX.data;
          const dataAsUint8Arr = bs58.decode(data);
          const call = dataAsUint8Arr[0];
          const amount = dataAsUint8Arr[1];

          const storeData = {
            input_tx_hash: "",
            payout_tx_hash: "",
            token_pubkey: config.mint,
            sender_account_pubkey: "",
            temp_token_account_pubkey: "",
            receiver_account_pubkey: "",
            receiver_token_account_pubkey: "",
            escrow_account_pubkey: "",
            escrow_amount: amount,
            expire_date: 0,
            completed: call,
          };

          if (call === 0) storeData.input_tx_hash = hash;
          if (call === 1) storeData.payout_tx_hash = hash;

          console.log(call, amount);
          console.log(escrowPubKey);
        }

        //   saveEscrow(tx);
      });
    });
  } catch (error) {
    console.log(error);
  }
})();
