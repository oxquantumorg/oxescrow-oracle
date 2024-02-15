import config from "../config";
const { Connection } = require("@solana/web3.js");

export const getConnection = async () => {
  const connection = new Connection(config.rpc, "recent");
  const version = await connection.getVersion();
  console.log("Connection to cluster established:", config.rpc, version);
  return connection;
};
