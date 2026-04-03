# HISA People Chain
### Kenya's Transparent AI Energy Trust Layer

> Hedera-based infrastructure that verifies energy assets, amplifies
> community voice, governs cooperatives democratically, and advocates
> for energy's role as the physical substrate of AI — routing value
> back to the CFAs and CBOs who power Kenya's renewable future.

**EPRA Hackathon 2025 | Challenge: Infrastructure Gaps & Energy Access**

This repository contains the backend architecture, autonomous AI agents, and Smart Contracts powering the HISA ecosystem, built entirely on the **Hedera network**.


---

## 🛠 Hedera Tech Stack Implementations

This project heavily leverages the Hedera ecosystem to guarantee trust, speed, and low-cost environmental impact tracking:

### 1. Hedera Token Service (HTS)
We utilize HTS for our four native tokens:
*   **$JANI**: Energy asset verification credential (`src/hedera/token.service.js`).
*   **$CHAT**: Community grievance & outage reporting credential.
*   **$UMOJA**: Energy cooperative governance vote token.
*   **$HISA**: AI intelligence layer + carbon credit value token.

### 2. Hedera Consensus Service (HCS)
Every critical action in the ecosystem acts as an immutable audit trail using HCS topics (`src/hedera/consensus.service.js`):
*   Trees registered and AI-validated.
*   Cultural Asset Council voting decisions.
*   SDG impact distributions.

### 3. Hedera Smart Contract Service (HSCS)
Our Solidity contracts (`/contracts`) manage the decentralized trust logic:
*   `TreeRegistry.sol`: On-chain validator signatures for Proof-of-Growth before HTS minting is allowed.
*   `CulturalAsset.sol`: Hardcodes royalty splits routing automated payouts to indigenous creators.
*   `ValidationPool.sol`: Staking and slashing mechanics for network validators.

### 4. Hedera Agent Developer Kit (ADK) & AI Agents
We have built **Autonomous Ecosystem Managers** using the Hedera ADK (`src/integrations/hedera-adk`):
*   Equipped with Langchain + custom HISA tools (`verify_tree_and_mint_jani`).
*   A `node-cron` executor runs cycles to autonomously read HCS logs and trigger smart contracts for reward distributions without human intervention.

### 5. Hedera Guardian (Verifiable Credentials)
We integrated Guardian's API (`src/integrations/guardian`) to issue real Verifiable Credentials (VCs):
*   **MRV Data**: GPS coordinates and species data are pushed as Monitoring, Reporting, and Verification (MRV) packages to trigger JANI tokens.

### 6. DOVU Carbon Credit Bridge
*   Once JANI tokens and Guardian VCs are minted, webhooks bridge to the DOVU API (`src/integrations/dovu`), automatically issuing and retiring fractional carbon credits for corporate ESG sponsors.

---

## 🏗 Architecture Details

*   **Node.js / Express**: Modular REST API handling the core logic pillars (JANI, CHAT, UMOJA, HISA).
*   **MongoDB**: Storing non-PII, encrypted user data references (hashes, IPFS CIDs).
*   **USSD Gateway**: An integrated Africa's Talking gateway (`/ussd`) providing feature-phone accessibility to the blockchain for rural users.

---

## 🚀 Running the Presentation Environment

While this is a Hackathon presentation build simulating the full environment, the scripts demonstrate the actual API flow:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Smart Contract Virtual Deployment
Simulates deploying the HSCS contracts and configuring HTS precompiles:
```bash
node scripts/deploy.js
```

### 3. Seed the Mock Ecosystem
Simulates active users, trees planted, and cultural assets registered:
```bash
node scripts/seed.js
```

### 4. Run the Core Test Suite
Our Jest suite mocks the Hedera SDK to demonstrate the autonomous agent triggers:
```bash
npm test
```

---

## 🤝 The Modules

*   **JANI (Proof of Growth)**: Gamified reforestation. Plant trees, get verified via AI/Community, earn HTS tokens.
*   **CHAT (Cultural Heritage)**: Digitize tribal assets (songs, dances, medicines) with FPIC consent and monetize via royalty-bearing NFTs.
*   **UMOJA (DeFi)**: Fractionalize SME and land assets. Stake $UMOS for yield. Access credit.
*   **HISA (Wellness)**: Mental health check-ins trigger cross-module SDG rewards via the ADK.

> Built for the **EPRA Hackathon 2025** by team HISA People Chain.
