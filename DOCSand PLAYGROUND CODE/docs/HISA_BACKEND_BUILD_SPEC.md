# HISA Backend Build Spec
## Energy Trust Layer Implementation

This document specifies the backend requirements and API endpoints for the HISA Energy Trust Layer, designed for the EPRA Hackathon 2025.

---

## Architecture Overview

HISA operates as an agentic AI intelligence layer sitting atop a four-module blockchain framework powered by Hedera.

## Energy Trust Layer Modules

### JANI — Energy Asset Verification
- **Endpoint:** `POST /api/jani/verify-asset`
- **Input:** `{ cfa_id, asset_type, gps_coords, capacity_kw }`
- **Action:** Mint HTS token, anchor metadata to Hedera Consensus Service (HCS)
- **Output:** `{ asset_id, hedera_tx_id, verification_hash }`

### CHAT — Grievance Logger
- **Endpoint:** `POST /api/chat/log`
- **Input:** `{ community_id, issue_type, location, timestamp }`
- **Action:** Submit to HCS topic, assign immutable sequence number
- **Output:** `{ log_id, hcs_sequence, tamper_proof_url }`

### UMOJA — Governance Vote
- **Endpoint:** `POST /api/umoja/vote`
- **Input:** `{ cooperative_id, proposal_id, vote, member_id }`
- **Action:** Record weighted vote on HCS, update tally smart contract
- **Output:** `{ vote_id, current_tally, quorum_status }`

### HISA — Agentic AI Intelligence Layer
- **Endpoint:** `GET /api/hisa/policy-dashboard`
- **Action:** Aggregate JANI + CHAT + UMOJA data, run AI analysis
- **Output:** `{ epra_briefing, esg_scores, carbon_credit_yield, alerts }`

---

## Technical Stack

- **L1/L2:** Hedera Hashgraph (HTS, HCS, HSCS)
- **Agentic Layer:** Hedera ADK + Langchain
- **Carbon Credits:** Hedera Guardian + DOVU
- **Accessibility:** USSD/SMS Gateway via Africa's Talking
- **Backend:** Node.js / Express
- **Database:** MongoDB (for non-immutable metadata)

---

## Environmental Integrity & ESG

All energy assets verified via JANI are tracked through Hedera Guardian to ensure high-fidelity MRV (Monitoring, Reporting, and Verification) for carbon credit eligibility.

---
*EPRA Hackathon 2025 | HISA People Chain*
