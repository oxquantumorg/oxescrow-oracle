import { IEscrow, Escrow } from "../escrow.model";

export const saveEscrow = async (data: any) => {
  await Escrow.create(data);
};

export const updateEscrow = async (pubKey: string, data: any) => {
  return Escrow.findOneAndUpdate(
    { escrow_account_pubkey: pubKey },
    { ...data },
    { returnOriginal: false }
  );
};

export const fetchEscrows = async (data: any) => {
  return Escrow.find(data).sort({ created_at: 1 });
};

// export const fetchEscrowsSort = async (data: any, block_time: number) => {
//   return Escrow.find({
//     ...data,
//     created_at: {
//       $gte: block_time,
//     },
//   });
// };

export const getEscrowByPubKey = async (pubKey: string) => {
  return Escrow.findOne({ escrow_account_pubkey: pubKey });
};
