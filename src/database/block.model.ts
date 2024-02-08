import { model, Schema } from "mongoose";

export interface IBlock {
  created_at: Date;
  updated_at: Date;
  signature: string;
  block_time: Date;
  block_index: number;
}

const blockSchema = new Schema<IBlock>(
  {
    signature: { type: String, unique: true },
    block_time: Date,
    block_index: Number,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Block = model<IBlock>("Block", blockSchema);
