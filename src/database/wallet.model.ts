import {model, Schema} from "mongoose";

export interface IWallet {
  created_at: Date;
  updated_at: Date;
  tx_hash: string;
  token_pubkey: string;
  sender_pubkey: string;
  sender_token_account_pubkey: string;
  receiver_account_pubkey: string;
  receiver_token_account_pubkey: string;
  amount: number;
}

const transactionSchema = new Schema<IWallet>(
  {
    amount: Number,
    tx_hash: { type: String, unique: true },
    token_pubkey: String,
    sender_pubkey: String,
    sender_token_account_pubkey: String,
    receiver_account_pubkey: String,
    receiver_token_account_pubkey: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Transaction = model<IWallet>('Transaction', transactionSchema)
