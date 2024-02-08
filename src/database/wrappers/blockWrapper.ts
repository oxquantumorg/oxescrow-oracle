import { Block } from "../block.model";

export const createBlock = async (data) => {
  return Block.create(data);
};

export const findBlock = async (sig: string) => {
  return Block.findOne({ signature: sig });
};
