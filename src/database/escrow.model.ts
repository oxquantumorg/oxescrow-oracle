import {model, Schema} from "mongoose";

export interface IEscrow {
  created_at: Date;
  updated_at: Date;
  payout_tx_hash: string;
  token_pubkey: string;
  sender_account_pubkey: string;
  temp_token_account_pubkey: string;
  receiver_account_pubkey: string;
  receiver_token_account_pubkey: string;
  escrow_account_pubkey: string;
  escrow_amount: number;
  expire_date: number;
}

const escrowSchema = new Schema<IEscrow>(
  {
    escrow_amount: Number,
    expire_date: Number,
    payout_tx_hash: { type: String, unique: true },
    escrow_account_pubkey: { type: String, unique: true },
    token_pubkey: String,
    sender_account_pubkey: String,
    temp_token_account_pubkey: String,
    receiver_account_pubkey: String,
    receiver_token_account_pubkey: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Escrow = model<IEscrow>('Escrow', escrowSchema)