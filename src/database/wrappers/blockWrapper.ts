import { Block } from "../block.model";

export const createBlock = async (data) => {
  return Block.create(data);
};

export const findBlock = async (sig: string) => {
  return Block.findOne({ signature: sig });
};

export const fetchBlocks = async (last_timestamp: Date) => {
  if (!last_timestamp) {
    return Block.find().sort({ created_at: -1 }).limit(20);
  }

  return Block.find({
    created_at: {
      $lte: last_timestamp,
    },
  })
    .sort({ created_at: -1 })
    .limit(20);
};
