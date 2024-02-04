import {
  Connection,
  PublicKey,
  TransactionSignature,
  Commitment,
  Transaction,
  ParsedInstruction,
  ConfirmedSignaturesForAddress2Options,
} from "@solana/web3.js";
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const targetAddress = new PublicKey(
  "JDvqLZ7ytrWUrPeDArR6E7XQe84VJExm6XvQHV5wst6N"
);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const commitment: Commitment = "confirmed";

const parseTokenDepositLog = (logInfo: any): any | null => {
  if (logInfo) {
    console.log("Token deposit:", logInfo);
  }
  return null;
};

const txHash =
  "4pJu6sfLFCuQKxU2d2QrCcLKFSYEgNCr2FGSeJbPYYncY4ySm9ibCBSqTE5jVfUbgS23WpBVT3eGY9TnJyhmf8J7";

const checkTx = async (txHash): Promise<void> => {
  const res2 = await connection.getParsedTransaction(txHash);
  const txs = res2.transaction.message.instructions;

  txs.forEach((instruction, index) => {
    if (instruction.programId.equals(TOKEN_PROGRAM_ID)) {
      const data = (instruction as ParsedInstruction).parsed.info;
      const source = data.source;
      const authority = data.authority;
      const destination = data.destination;
      const amount = data.amount;

      console.log(`Instruction ${index + 1}:`);
      console.log("Token Account:", source);
      console.log("Destination Account:", destination);
      console.log("Authority Account:", authority);
      console.log("Amount:", amount);
    }
  });

  return null;
};

const indexEscrows = async () => {

  const res = await connection.getConfirmedSignaturesForAddress2(
    targetAddress,
    {
      limit: 3,
      until:
        "2nqoi2PoeKWjDJSe5PKtYwUhCnF9eTJLCAsXLFFvRxAaANjWm9NjBFiFxZCMd7qtK3wuqEMpVE8HfpgoFgzyFBRS",
    }
  );
  console.log(res);
};

export default indexEscrows;
