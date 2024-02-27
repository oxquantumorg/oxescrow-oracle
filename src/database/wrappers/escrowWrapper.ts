import { Escrow } from "../escrow.model";

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

export const fetchEscrowsSkip = async (prev_escrow_index: number) => {
  return Escrow.find({
    index: {
      $gte: prev_escrow_index,
    },
    completed: 0,
  })
    .sort({ index: 1 })
    .limit(10);
};

export const getEscrowByPubKey = async (pubKey: string) => {
  return Escrow.findOne({ escrow_account_pubkey: pubKey });
};

export const getEscrowByAcc = async (pubKey: string) => {
  return Escrow.findOne({ temp_token_account_pubkey: pubKey });
};
