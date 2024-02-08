import { Data } from "../data.model";

export const initData = async () => {
  const indexEscrow = {
    id: 1,
    last_block_hash: undefined,
    block_count: 0,
    escrow_count: 0,
    wallet_count: 0,
    synced: 0,
    working: 0,
    workingEscrow: 0,
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

export const closeSync = async () => {
  const data = await Data.findOneAndUpdate(
    { id: 1 },
    { synced: 1 },
    { returnOriginal: false }
  );

  data.last_block_hash = undefined;
  await data.save();
};

export const startWork = async (status: number) => {
  return await Data.findOneAndUpdate(
    { id: 1 },
    { working: status },
    { returnOriginal: false }
  );
};

export const startWorkEscrow = async (status: number) => {
  return await Data.findOneAndUpdate(
    { id: 1 },
    { working_escrow: status },
    { returnOriginal: false }
  );
};
