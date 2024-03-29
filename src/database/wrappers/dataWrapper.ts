import { Data } from "../data.model";

export const initData = async () => {
  const indexEscrow = {
    id: 1,
    entry_block_hash: undefined,
    prev_block_hash: undefined,
    prev_block_index: 0,
    block_count: 0,
    escrow_count: 0,
    reverse: 0,
    wallet_count: 0,
    synced: 0,
    working: 0,
    working_escrow: 0,
    working_release_escrow: 0,
  };
  return Data.create(indexEscrow);
};

export const getOrCreateData = async () => {
  let escrow = await Data.findOne({ id: 1 });
  if (!escrow) {
    escrow = await initData();
  }

  return escrow;
};

export const getData = async () => {
  return Data.findOne({ id: 1 });
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

export const startWorkReleaseEscrow = async (status: number) => {
  return await Data.findOneAndUpdate(
    { id: 1 },
    { working_release_escrow: status },
    { returnOriginal: false }
  );
};
