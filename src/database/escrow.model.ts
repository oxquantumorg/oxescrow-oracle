import {model, Schema} from "mongoose";

export interface IEscrow {
  created_at: Date;
  updated_at: Date;
  input_tx_hash: string;
  payout_tx_hash: string;
  token_pubkey: string;
  initializer_account_pubkey: string;
  temp_token_account_pubkey: string;
  receiver_account_pubkey: string;
  receiver_token_account_pubkey: string;
  escrow_account_pubkey: string;
  escrow_amount: number;
  expire_date: number;
  index: number;
  completed: number;
  status: string; // waiting-deposit, pending-release, released
}

const escrowSchema = new Schema<IEscrow>(
  {
    escrow_amount: Number,
    expire_date: Number,
    index: Number,
    input_tx_hash: { type: String, unique: true },
    payout_tx_hash: String,
    escrow_account_pubkey: String,
    token_pubkey: String,
    status: String,
    completed: Number,
    initializer_account_pubkey: String,
    temp_token_account_pubkey: String,
    receiver_account_pubkey: String,
    receiver_token_account_pubkey: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Escrow = model<IEscrow>('Escrow', escrowSchema)
