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

export const getEscrows = async (data: any) => {
  return Escrow.find(data);
};

export const getEscrowByPubKey = async (pubKey: string) => {
  return Escrow.findOne({ escrow_account_pubkey: pubKey });
};
