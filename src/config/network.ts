import config from ".";
const { Connection } = require("@solana/web3.js");

export const getConnection = async () => {
  const connection = new Connection(config.rpc, "recent");
  return connection;
};
