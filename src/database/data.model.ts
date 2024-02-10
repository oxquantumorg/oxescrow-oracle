import { model, Schema } from "mongoose";

export interface IData {
  created_at: Date;
  updated_at: Date;
  id: number;
  prev_block_hash: string | undefined;
  entry_block_hash: string | undefined;
  reverse: number;
  prev_block_index: number;
  synced: number;
  working: number;
  working_escrow: number;
  block_count: number;
  escrow_count: number;
  wallet_count: number;
}

const dataSchema = new Schema<IData>(
  {
    id: { type: Number, unique: true },
    prev_block_hash: String || undefined,
    entry_block_hash: String || undefined,
    prev_block_index: Number,
    reverse: Number,
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
