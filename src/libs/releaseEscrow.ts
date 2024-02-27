import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import config from "../config";
import { getConnection } from "./network";
import { getAdminAcc, getTokenBalance } from "../config/utils";
import { IEscrow } from "../database/escrow.model";

const {
  PublicKey,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const BN = require("bn.js");

export const releaseEscrow = async (escrow: IEscrow) => {
  const connection = await getConnection();
  const escrowProgramId = config.programPubkey;

  const receiverPubKey = new PublicKey(escrow.receiver_account_pubkey);
  const tempTokenPubKey = new PublicKey(escrow.temp_token_account_pubkey);
  const escrowPubKey = new PublicKey(escrow.escrow_account_pubkey);
  const callerAcc = getAdminAcc();
  const initializerPubKey = new PublicKey(escrow.initializer_account_pubkey);
  const callerPubKey = callerAcc.publicKey;
  const amount = escrow.escrow_amount;

  const tempTokenAccBalance = await getTokenBalance(
    tempTokenPubKey,
    connection
  );

  if (tempTokenAccBalance < amount) {
    throw new Error("Usdt not deposited to wallet yet");
  }

  const receiverTokenPubKey = (
    await getOrCreateAssociatedTokenAccount(
      connection,
      callerAcc,
      config.mint,
      receiverPubKey,
      false
    )
  ).address;

  const PDA = await PublicKey.findProgramAddress(
    [Buffer.from("escrow")],
    escrowProgramId
  );

  // Creating escrow release instruction
  const releaseEscrowIX = new TransactionInstruction({
    programId: escrowProgramId,
    data: Buffer.from(Uint8Array.of(1, ...new BN(amount).toArray("le", 8))),
    keys: [
      { pubkey: receiverTokenPubKey, isSigner: false, isWritable: true },
      {
        pubkey: tempTokenPubKey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: initializerPubKey,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: escrowPubKey, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: PDA[0], isSigner: false, isWritable: false },
      { pubkey: callerPubKey, isSigner: true, isWritable: false },
    ],
  });

  const balBefore = await getTokenBalance(receiverTokenPubKey, connection);

  const res = await connection.sendTransaction(
    new Transaction().add(releaseEscrowIX),
    [callerAcc],
    { skipPreflight: false, preflightCommitment: "confirmed" }
  );

  console.log("Escrow Account:", escrowPubKey);
  console.log("Transaction Hash:", res);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const balAfter = await getTokenBalance(receiverTokenPubKey, connection);

  if (balAfter !== balBefore + amount) {
    throw new Error(`Error: fail to release tokens!!`);
  }

  return { balAfter, balBefore, txHash: res };
};
