import { Data } from "../data.model";

export const initData = async () => {
  const indexEscrow = {
    id: 1,
    last_block_hash:
      "5tNpEuxEPCYed8ybT3byWGNYGM2rctF4KDQXf5A2EdEEcUuiogM8zXCZBLXuVSPGx1fKhJYy6awAkYz9t97Nnj7m",
    escrow_count: 0,
    wallet_count: 0,
  };
  return Data.create(indexEscrow);
};

export const getData = async () => {
  let escrow = await Data.findOne({ id: 1 });
  if (!escrow) {
    escrow = await initData();
  }

  return escrow;
};

export const updateData = async (data: any) => {
  return Data.findOneAndUpdate(
    { id: 1 },
    { ...data },
    { returnOriginal: false }
  );
};
