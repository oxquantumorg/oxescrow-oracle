import { model, Schema } from "mongoose";

export interface IData {
  created_at: Date;
  updated_at: Date;
  id: string;
  last_block_hash: string | undefined;
  last_block_time: Date;
  synced: number;
  working: number;
  working_escrow: number;
  block_count: number;
  escrow_count: number;
  wallet_count: number;
}

const dataSchema = new Schema<IData>(
  {
    id: String,
    last_block_hash: String || undefined,
    last_block_time: Date,
    synced: Number,
    working: Number,
    working_escrow: Number,
    block_count: Number,
    escrow_count: Number,
    wallet_count: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Data = model<IData>("Data", dataSchema);
