import { IEscrow, Escrow } from "../escrow.model";

export const saveTx = async (data: IEscrow) => {
  await Escrow.create(data);
};

// export const updateTx = async (txHash: string, payoutHash: string) => {
//   return Escrow.findOneAndUpdate(
//     { tx_hash: txHash },
//     { payout_hash: payoutHash },
//     { returnOriginal: false }
//   );
// };

export const getTxs = async () => {
  return Escrow.find();
};

export const getTxByHash = async (hash: string) => {
  return Escrow.findOne({ tx_hash: hash });
};
