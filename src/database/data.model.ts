import { model, Schema } from "mongoose";

export interface IData {
  created_at: Date;
  updated_at: Date;
  id: string;
  last_block_hash: string;
  escrow_count: number;
  wallet_count: number;
}

const dataSchema = new Schema<IData>(
  {
    id: String,
    last_block_hash: String,
    escrow_count: Number,
    wallet_count: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Data = model<IData>("Data", dataSchema);
