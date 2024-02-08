import { model, Schema } from "mongoose";

export interface IData {
  created_at: Date;
  updated_at: Date;
  id: string;
  last_block_hash: string | undefined;
  synced: number;
  working: number;
  block_count: number;
  escrow_count: number;
  wallet_count: number;
}

const dataSchema = new Schema<IData>(
  {
    id: String,
    last_block_hash: String || undefined,
    synced: Number,
    working: Number,
    block_count: Number,
    escrow_count: Number,
    wallet_count: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Data = model<IData>("Data", dataSchema);
