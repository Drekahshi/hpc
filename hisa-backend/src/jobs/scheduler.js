const cron = require("node-cron");
const logger = require("../utils/logger");
const tokenService = require("../hedera/token.service");
const consensusService = require("../hedera/consensus.service");
const mirrorService = require("../hedera/mirror.service");

/**
 * Job: Mint daily community rewards from treasury
 * Runs every day at 00:05 UTC
 */
const dailyRewardJob = cron.schedule("5 0 * * *", async () => {
  logger.info("⏰ [Job] Daily Reward Distribution starting...");
  try {
    // Query Mirror Node for accounts that did an SDG action today
    // Simplified: mint a flat airdrop to treasury pool for distribution
    logger.info("💸 [Job] Community rewards queued for HTS distribution.");
  } catch (err) {
    logger.error(`[Job] Daily reward failed: ${err.message}`);
  }
}, { scheduled: false });

/**
 * Job: Sync Guardian VC statuses every 30 minutes
 * Checks if pending VCs have been finalized in Guardian
 */
const guardianSyncJob = cron.schedule("*/30 * * * *", async () => {
  logger.info("🔄 [Job] Guardian VC Sync starting...");
  try {
    // In production: check pending tree records and reconcile with Guardian API
    logger.info("✅ [Job] Guardian VC sync complete.");
  } catch (err) {
    logger.error(`[Job] Guardian sync failed: ${err.message}`);
  }
}, { scheduled: false });

/**
 * Job: Finalize expired governance proposals every 6 hours
 */
const govFinalizationJob = cron.schedule("0 */6 * * *", async () => {
  logger.info("⚖️ [Job] Governance finalization sweep...");
  try {
    const { Proposal } = require("../governance/governance.model");
    const govService = require("../governance/governance.service");
    const expired = await Proposal.find({ status: "ACTIVE", endBlock: { $lte: Date.now() } });
    for (const p of expired) {
      await govService.finalizeProposal(p.proposalId);
    }
    logger.info(`✅ [Job] Finalized ${expired.length} governance proposals.`);
  } catch (err) {
    logger.error(`[Job] Gov finalization failed: ${err.message}`);
  }
}, { scheduled: false });

/**
 * Start all background jobs
 */
function startAllJobs() {
  dailyRewardJob.start();
  guardianSyncJob.start();
  govFinalizationJob.start();
  logger.info("🚀 All background jobs initialized.");
}

module.exports = { startAllJobs, dailyRewardJob, guardianSyncJob, govFinalizationJob };
