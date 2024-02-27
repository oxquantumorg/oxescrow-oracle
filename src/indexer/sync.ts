import {
  closeSync,
  getOrCreateData,
  startWork,
  updateData,
} from "../database/wrappers/dataWrapper";
import { createBlock, findBlock } from "../database/wrappers/blockWrapper";
import { fetchOnChainBlocks } from "../libs/fetchOnChainBlocks";

export default async () => {
  try {
    const data = await getOrCreateData();
    if (!data) {
      console.log("- No data");
      return;
    }
    if (data.working === 1) {
      console.log("- Working...");
      return;
    }
    await startWork(1);

    let before = data.prev_block_hash;
    // A call to the function that picks up all new transaction.
    const blocks = await fetchOnChainBlocks(before);

    if (blocks.length === 0) {
      await closeSync();
      startWork(0);
      return;
    }

    let blockCount = Number(data.block_count);
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];
      const blockExists = await findBlock(block.signature);
      if (blockExists) {
        await closeSync();
        console.log("- Duplicate block.....");
        console.log("-", block.signature);
        await startWork(0);
        break;
      }

      await updateData({
        prev_block_hash: block.signature,
      });
  
      await createBlock({
        signature: block.signature,
        block_time: block.blockTime,
        block_index: Date.now(),
      });

      console.log("------------");
      console.log(block);
      console.log("------------");
      blockCount += 1;
    }

    await updateData({
      block_count: blockCount,
    });
    await startWork(0);
  } catch (e) {
    console.log(e);
    await startWork(0);
  }
};
