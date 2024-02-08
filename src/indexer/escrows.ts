import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js";
import { getData, updateData } from "../database/wrappers/dataWrapper";
import bs58 from "bs58";
import config from "../config";
import {
  getEscrowByPubKey,
  saveEscrow,
  updateEscrow,
} from "../database/wrappers/escrowWrapper";
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export default async () => {
  try {
    const data = await getData();
    if (!data) {
      console.log("no data");
      return;
    }

    const programPubkey = config.programPubkey;
    let before = data.last_block_hash;
    const options = { limit: 2, before };
    const co = await connection.getTransactionCount()
    console.log(co);
    
    const blocks = await connection.getConfirmedSignaturesForAddress2(
      programPubkey,
      options
    );
    before = blocks[blocks.length - 1].signature;
    await updateData({
      last_block_hash: before,
    });
    console.log(blocks);

    return;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockHash = block.signature;
      const res = await connection.getParsedTransaction(blockHash);
      const txs = res.transaction.message.instructions;

      for (let j = 0; j < txs.length; j++) {
        const tx = txs[j];
        if (tx.programId.equals(programPubkey)) {
          // console.log("---");
          // console.log("lastBlockHash", lastBlockHash);
          // console.log("---");
          // console.log("blockHash", blockHash);
          const txIX: any = tx as ParsedInstruction;
          const accounts = txIX.accounts;
          const escrowPubKey: string = accounts[3].toString();
          const txData = txIX.data;
          const dataAsUint8Arr = bs58.decode(txData);
          const call = dataAsUint8Arr[0];
          const amount = dataAsUint8Arr[1];
          const mint = config.mint.toString();

          const escrow_count = (await getData()).escrow_count;

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
            index: escrow_count,
          };

          const escrow = await getEscrowByPubKey(escrowPubKey);
          if (!escrow && call === 0) {
            storeData.input_tx_hash = blockHash;
            storeData.sender_account_pubkey = accounts[0].toString();
            storeData.receiver_account_pubkey = accounts[1].toString();
            storeData.temp_token_account_pubkey = accounts[2].toString();
            storeData.escrow_account_pubkey = escrowPubKey;
            await saveEscrow(storeData);
            await updateData({
              escrow_count: escrow_count + 1,
            });
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

          await updateData({
            last_block_hash: blockHash,
          });
          console.log("------");
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
};
