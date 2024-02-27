import { IEscrow, Escrow } from "../escrow.model";

export const saveTx = async (data: IEscrow) => {
  await Escrow.create(data);
};

export const getTxs = async () => {
  return Escrow.find();
};

export const getTxByHash = async (hash: string) => {
  return Escrow.findOne({ tx_hash: hash });
};
