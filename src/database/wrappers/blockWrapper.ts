import { Block } from "../block.model";

export const createBlock = async (data) => {
  return Block.create(data);
};

export const findBlock = async (sig: string) => {
  return Block.findOne({ signature: sig });
};

export const fetchBlocks = async (last_block_index: number) => {
  if (!last_block_index) {
    return Block.find().sort({ created_at: -1 }).limit(20);
  }

  return Block.find({
    block_index: {
      $lte: last_block_index,
    },
  })
    .sort({ created_at: -1 })
    .limit(20);
};
