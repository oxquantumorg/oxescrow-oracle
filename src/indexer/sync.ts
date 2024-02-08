import { Connection, ParsedInstruction, PublicKey } from "@solana/web3.js";
import {
  closeSync,
  getData,
  startWork,
  updateData,
} from "../database/wrappers/dataWrapper";
import config from "../config";
import { createBlock, findBlock } from "../database/wrappers/blockWrapper";
const connection = new Connection(config.rpc, "confirmed");

export default async () => {
  try {
    const data = await getData();
    if (!data) {
      console.log("no data");
      return;
    }
    if (data.working === 1) {
      console.log("working...");
      return;
    }
    await startWork(1);

    const programPubkey = config.programPubkey;
    let before = data.last_block_hash;
    const options = { limit: 10, before };
    const blocks = await connection.getConfirmedSignaturesForAddress2(
      programPubkey,
      options
    );

    if (blocks.length === 0) {
      await closeSync();
      console.log("Index complete.....");
      await startWork(0);
      return;
    }

    before = blocks[blocks.length - 1].signature;
    let blockCount = data.block_count;
    await updateData({
      last_block_hash: before,
    });

    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];

      const blockExists = await findBlock(block.signature);
      if (blockExists) {
        await closeSync();
        console.log("Duplicate block ==> Index complete.....");
        await startWork(0);
        return;
      }
      await createBlock({
        signature: block.signature,
        block_time: block.blockTime,
      });

      console.log("------------");
      console.log(block);
      console.log("------------");
      blockCount += 1;
      await updateData({
        block_count: blockCount,
      });
    }

    await startWork(0);
  } catch (e) {
    console.log(e);
    await startWork(0);
  }
};
