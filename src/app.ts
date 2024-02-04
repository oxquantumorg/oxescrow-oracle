require("./config/global");
import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js";
import { getData } from "./database/wrappers/dataWrapper";
const BN = require("bn.js");
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
    const escrowProgramPubkey = new PublicKey(
      "JDvqLZ7ytrWUrPeDArR6E7XQe84VJExm6XvQHV5wst6N"
    );
    const options = { limit: 1, until: lastBlockHash };
    const blocks = await connection.getConfirmedSignaturesForAddress2(
      escrowProgramPubkey,
      options
    );

    blocks.forEach(async (block) => {
      const res = await connection.getParsedTransaction(block.signature);
      const txs = res.transaction.message.instructions;
      txs.forEach(async (tx) => {
        //   console.log(txs);
        if (tx.programId.equals(escrowProgramPubkey)) {
          const txIX = tx as any;
          const escrowPubKey = JSON.stringify(txIX.accounts[3]);
          const data = txIX.data;
          const bufferResult = Uint8Array.from(data)
          const inst = bufferResult[0]
          const res = [...bufferResult]
          res.shift()
          console.log(inst);
        // const valueBytes = bufferResult.slice(1);
        const transferAmount = new BN(bufferResult, 10, 'le');
        console.log(transferAmount.toString());
        
        }

        //   saveEscrow(tx);
      });
    });
  } catch (error) {
    console.log(error);
  }
})();
