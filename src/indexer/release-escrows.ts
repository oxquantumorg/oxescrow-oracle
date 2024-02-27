import { logError } from "../config/utils";
import {
  getData,
  startWorkReleaseEscrow,
} from "../database/wrappers/dataWrapper";
import { fetchEscrowsSkip } from "../database/wrappers/escrowWrapper";
import { releaseEscrow } from "../libs/releaseEscrow";

export default async () => {
  try {
    const data = await getData();
    if (!data) {
      console.log("- No data");
      return;
    }

    if (data.synced === 0) {
      console.log("- Syncing blocks...");
      return;
    }

    if (data.working_release_escrow === 1) {
      console.log("- Working Release escrow...");
      return;
    }

    await startWorkReleaseEscrow(1);
    console.log("- Release Escrow index start...");

    const prev_index = 0;
    const escrows = await fetchEscrowsSkip(prev_index);
    if (escrows.length === 0) {
      console.log("- No new escrows.....");
      await startWorkReleaseEscrow(0);
      return;
    }

    // prev_index = escrows[escrows.length - 1].index;
    for (let i = 0; i < escrows.length; i++) {
      const escrow = escrows[i];
      const curDate = Math.floor(Date.now() / 1000);
      const expireDate = new Date(escrow.expire_date).getTime();

      if (curDate < expireDate) {
        // prev_index = escrow.index;
        console.log("- Escrow still pending");
        console.log("-", escrow.index);
        continue;
      }

      await releaseEscrow(escrow);
    }
    await startWorkReleaseEscrow(0);
    console.log("- Escrow release end...");
  } catch (error) {
    logError(error);
    startWorkReleaseEscrow(0);
  }
};
