import { Connection } from "@solana/web3.js";
import config from "../config";
const connection = new Connection(config.rpc, "confirmed");

export const fetchOnChainBlocks = async (
  stopBlockHash: string = ""
): Promise<any[]> => {
  let before = undefined;
  const batchSize = 20;
  let res = [];
  let fetched = await connection.getConfirmedSignaturesForAddress2(
    config.programPubkey,
    {
      limit: batchSize,
      before,
    }
  );

  if (fetched.length === 0) return res;
  before = fetched[fetched.length - 1].signature;
  for (let i = 0; i < fetched.length; i++) {
    const element = fetched[i];
    if (element.signature === stopBlockHash) {
      res.reverse();
      console.log("- Found", res.length, "blocks");
      return res;
    } else {
      res.push(element);
    }
  }
  let synced = 0;
  while (synced === 0) {
    fetched = await connection.getConfirmedSignaturesForAddress2(
      config.programPubkey,
      {
        limit: batchSize,
        before,
      }
    );

    if (fetched.length > 0) {
      before = fetched[fetched.length - 1].signature;
      //   res = res.concat(fetched);
      if (fetched.length !== batchSize) {
        synced = 1;
      }
      for (let i = 0; i < fetched.length; i++) {
        const element = fetched[i];
        if (element.signature === stopBlockHash) {
          synced = 1;
          break;
        } else {
          res.push(element);
        }
      }
    } else {
      synced = 1;
    }
  }
  res.reverse();
  console.log("- Found", res.length, "blocks");

  return res;
};
