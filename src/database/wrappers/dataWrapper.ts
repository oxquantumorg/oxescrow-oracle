import { IData, Data } from "../data.model";

export const saveTx = async (data: IData) => {
  await Data.create(data);
};

// export const updateTx = async (txHash: string, payoutHash: string) => {
//   return Data.findOneAndUpdate(
//     { tx_hash: txHash },
//     { payout_hash: payoutHash },
//     { returnOriginal: false }
//   );
// };

export const getData = async () => {
  return (await Data.find().exec())[0];
};

export const getTxByHash = async (hash: string) => {
  return Data.findOne({ tx_hash: hash });
};
