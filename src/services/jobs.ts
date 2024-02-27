import { escrowIndex, releaseEscrowIndex, syncIndex } from "../indexer";
const cron = require("node-cron");

cron.schedule("*/10 * * * * *", () => {
  syncIndex();
});

cron.schedule("*/10 * * * * *", () => {
  escrowIndex();
});

cron.schedule("*/5 * * * *", () => {
  releaseEscrowIndex();
});
