import { Connection, ParsedInstruction } from "@solana/web3.js";
import {
  getData,
  startWorkEscrow,
  updateData,
} from "../database/wrappers/dataWrapper";
import bs58 from "bs58";
import config from "../config";
import {
  getEscrowByPubKey,
  saveEscrow,
  updateEscrow,
} from "../database/wrappers/escrowWrapper";
import { fetchBlocks } from "../database/wrappers/blockWrapper";
const connection = new Connection(config.rpc, "confirmed");

export default async () => {
  try {
    const data = await getData();
    if (!data) {
      console.log("- No data");
      return;
    }
    if (data.synced === 0) {
      console.log("- Syncing blocks...");
      return;
    }
    if (data.working_escrow === 1) {
      console.log("- Working escrow...");
      return;
    }
    await startWorkEscrow(1);

    const blocks = await fetchBlocks(data.last_block_index);

    if (blocks.length === 0) {
      console.log("- No new blocks.....");
      await startWorkEscrow(0);
      return;
    }

    await updateData({
      last_block_index: blocks[blocks.length - 1].block_index,
    });

    const programPubkey = config.programPubkey;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const blockHash = block.signature;
      const res = await connection.getParsedTransaction(blockHash);
      const txs = res.transaction.message.instructions;

      for (let j = 0; j < txs.length; j++) {
        const tx = txs[j];
        if (tx.programId.equals(programPubkey)) {
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
            expire_date: new Date(block.block_time).getUTCSeconds() + 300,
            completed: call,
            index: escrow_count,
          };

          const escrow = await getEscrowByPubKey(escrowPubKey);
          let logged = false;
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
            console.log("- Escrow Created");
            logged = true;
          }

          if (escrow && call === 1) {
            const updateEscrowData: any = {};
            updateEscrowData.receiver_token_account_pubkey =
              accounts[1].toString();
            updateEscrowData.completed = 1;
            updateEscrowData.payout_tx_hash = blockHash;
            await updateEscrow(escrowPubKey, updateEscrowData);
            console.log("- Escrow Completed");
            logged = true;
          }

          if (logged) {
            console.log("- BlockHash", blockHash);
            console.log("- Call", call);
            console.log("- Amount", amount);
            console.log("- EscrowPubKey", escrowPubKey);
          }
          console.log("- End Escrow Index.....");
        }
      }
    }
    await startWorkEscrow(0);
  } catch (error) {
    console.log(error);
    await startWorkEscrow(0);
  }
};
