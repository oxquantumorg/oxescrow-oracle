import { ITransaction, Transaction } from "./transaction.model";

export const saveTx = async (data: ITransaction) => {
  await Transaction.create(data);
};

// export const updateTx = async (txHash: string, payoutHash: string) => {
//   return Transaction.findOneAndUpdate(
//     { tx_hash: txHash },
//     { payout_hash: payoutHash },
//     { returnOriginal: false }
//   );
// };

export const getTxs = async () => {
  return Transaction.find();
};

export const getTxByHash = async (hash: string) => {
  return Transaction.findOne({ tx_hash: hash });
};
