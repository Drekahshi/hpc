const { Proposal, Vote } = require("./governance.model");
const consensusService = require("../hedera/consensus.service");
const tokenService = require("../hedera/token.service");
const logger = require("../utils/logger");
const { generateHISAId } = require("../utils/helpers");

class GovernanceService {
  /**
   * Create a new governance proposal and record it on HCS
   */
  async createProposal(data) {
    const { title, description, proposerAccountId, category } = data;

    const proposalId = generateHISAId("GOV");
    const proposal = await Proposal.create({
      proposalId, title, description, proposerAccountId, category,
      startBlock: Date.now(),
      endBlock: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7-day voting window
    });

    const hcsId = await consensusService.submitMessage(process.env.GOVERNANCE_TOPIC_ID, {
      module: "GOVERNANCE",
      action: "PROPOSAL_CREATED",
      actorAccountId: proposerAccountId,
      payload: { proposalId, title, category },
    });

    proposal.hcsMessageId = hcsId;
    await proposal.save();

    logger.info(`Proposal created: ${proposalId}`);
    return proposal;
  }

  /**
   * Cast a vote on a proposal (1 account = 1 vote, voting power = HISA token balance)
   */
  async castVote(proposalId, accountId, voteChoice, votingPower = 1) {
    const proposal = await Proposal.findOne({ proposalId, status: "ACTIVE" });
    if (!proposal) throw new Error("Proposal not found or not active");

    // Enforce voting window
    if (Date.now() > proposal.endBlock) throw new Error("Voting period has ended");

    const existingVote = await Vote.findOne({ proposalId, accountId });
    if (existingVote) throw new Error("You have already voted on this proposal");

    await Vote.create({ proposalId, accountId, vote: voteChoice, votingPower });

    if (voteChoice === "FOR") {
      proposal.votesFor += votingPower;
    } else if (voteChoice === "AGAINST") {
      proposal.votesAgainst += votingPower;
    }

    await proposal.save();

    await consensusService.submitMessage(process.env.GOVERNANCE_TOPIC_ID, {
      module: "GOVERNANCE",
      action: "VOTE_CAST",
      actorAccountId: accountId,
      payload: { proposalId, voteChoice, votingPower },
    });

    return { proposalId, voteChoice, votingPower };
  }

  /**
   * Tally votes and finalize the proposal
   */
  async finalizeProposal(proposalId) {
    const proposal = await Proposal.findOne({ proposalId });
    if (!proposal || proposal.status !== "ACTIVE") throw new Error("Cannot finalize");

    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forRatio   = totalVotes > 0 ? proposal.votesFor / totalVotes : 0;

    proposal.status = forRatio >= (1 - proposal.quorumRequired) ? "PASSED" : "REJECTED";
    await proposal.save();

    logger.info(`Proposal ${proposalId} finalized as ${proposal.status} (${(forRatio * 100).toFixed(1)}% for)`);
    return proposal;
  }
}

module.exports = new GovernanceService();
