import { Block } from "../block.model";

export const createBlock = async (data) => {
  return Block.create(data);
};

export const findBlock = async (sig: string) => {
  return Block.findOne({ signature: sig });
};

export const fetchBlocks = async (
  prev_block_index: number,
  reverse: number
) => {
  console.log(prev_block_index, reverse);
  
  if (reverse === 1) {
    return Block.find({
      block_index: {
        $lte: prev_block_index,
      },
    })
      .sort({ block_index: -1 })
      .limit(10);
  }

  return Block.find({
    block_index: {
      $gte: prev_block_index,
    },
  })
    .sort({ block_index: 1 })
    .limit(10);
};
