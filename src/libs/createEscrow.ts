import {
  createInitializeAccountInstruction,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, sendAndConfirmTransaction } from "@solana/web3.js";
import config from "../config";
import { getConnection } from "./network";
import { ESCROW_ACCOUNT_DATA_LAYOUT, getAdminAcc } from "../config/utils";

const {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const BN = require("bn.js");

export const createEscrow = async (
  amount: number,
  senderPublicKey: string,
  receiverPubKey: string
) => {
  const connection = await getConnection();
  const escrowProgramId = config.programPubkey;
  const usdcMintPubKey = config.mint;

  const creatorAcc = getAdminAcc();
  const creatorPubKey = creatorAcc.publicKey;
  const tempMintAcc = new Keypair();

  const tempTokenAccountIX = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
    ),
    fromPubkey: creatorPubKey,
    newAccountPubkey: tempMintAcc.publicKey,
  });
  const initTempAccountIX = createInitializeAccountInstruction(
    tempMintAcc.publicKey,
    usdcMintPubKey,
    creatorPubKey
  );

  const escrowAcc = new Keypair();
  const createEscrowAccountIUsdc = SystemProgram.createAccount({
    space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
    lamports: await connection.getMinimumBalanceForRentExemption(
      ESCROW_ACCOUNT_DATA_LAYOUT.span
    ),
    fromPubkey: creatorPubKey,
    newAccountPubkey: escrowAcc.publicKey,
    programId: escrowProgramId,
  });

  const initEscrowIUsdc = new TransactionInstruction({
    programId: escrowProgramId,
    keys: [
      {
        pubkey: new PublicKey(senderPublicKey),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: new PublicKey(receiverPubKey),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: tempMintAcc.publicKey,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: escrowAcc.publicKey, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: creatorPubKey, isSigner: true, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...new BN(amount).toArray("le", 1))),
  });

  const tx = new Transaction().add(
    tempTokenAccountIX,
    initTempAccountIX,
    createEscrowAccountIUsdc,
    initEscrowIUsdc
  );

  const res = await sendAndConfirmTransaction(connection, tx, [
    creatorAcc,
    tempMintAcc,
    escrowAcc,
  ]);
  console.log("Escrow Account:", escrowAcc.publicKey);
  console.log("Transaction Hash:", res);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const escrowAccount = await connection.getAccountInfo(escrowAcc.publicKey);

  if (escrowAccount === null || escrowAccount.data.length === 0) {
    new Error("Escrow state account has not been initialized properly");
  }

  const encodedEscrowState = escrowAccount.data;
  const decodedEscrowState =
    ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState);
  console.log("Escrow state:", decodedEscrowState);

  if (!decodedEscrowState.isInitialized) {
    new Error("Escrow state initialization flag has not been set");
  }

  if (
    !new PublicKey(decodedEscrowState.initializerPubkey).equals(
      new PublicKey(senderPublicKey)
    )
  ) {
    throw new Error(
      "InitializerPubkey has not been set correctly / not been set to Alice's public key"
    );
  }

  if (
    !new PublicKey(decodedEscrowState.initializerTempTokenAccountPubkey).equals(
      tempMintAcc.publicKey
    )
  ) {
    throw new Error(
      "initializerTempTokenAccountPubkey has not been set correctly or not been set to temp Usdc token account public key"
    );
  }

  return escrowAcc.publicKey.toString();
};
