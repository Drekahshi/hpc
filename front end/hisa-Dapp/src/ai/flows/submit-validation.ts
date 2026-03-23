
'use server';

/**
 * @fileOverview A flow to submit validation data for a tree.
 *
 * - submitValidation - A function that handles the validation submission process.
 * - SubmitValidationInput - The input type for the submitValidation function
 * - SubmitValidationOutput - The return type for the submitValidation function
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { Client, PrivateKey, TopicMessageSubmitTransaction } from '@hashgraph/sdk';

// Helper to ensure Firebase Admin is initialized only once.
function ensureFirebaseAdminInitialized() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  return admin.firestore();
}

const SubmitValidationInputSchema = z.object({
  treeId: z.string(),
  photos: z.array(z.string().describe("A photo of the tree, as a data URI.")),
  measurements: z.object({
    height: z.number(),
    diameter: z.number(),
    healthScore: z.number(),
  }),
  notes: z.string(),
});
export type SubmitValidationInput = z.infer<typeof SubmitValidationInputSchema>;

const SubmitValidationOutputSchema = z.object({
  success: z.boolean(),
  verificationId: z.string().optional(),
  message: z.string(),
});
export type SubmitValidationOutput = z.infer<typeof SubmitValidationOutputSchema>;

// This is a placeholder for a real IPFS upload service
async function uploadToIPFS(photoDataUris: string[]): Promise<string[]> {
  // In a real implementation, this would upload data to IPFS and return hashes.
  // For now, we'll just return placeholders.
  return photoDataUris.map((_, index) => `ipfs_hash_placeholder_${index}`);
}

async function triggerAIValidation(db: admin.firestore.Firestore, verificationId: string) {
  // In a real app, this would call an external AI service.
  // For now, we simulate a successful AI validation.
  const aiResult = {
    confidence: 92,
    anomalyDetected: false,
    fraudRisk: 'low'
  };

  await db.collection('verifications').doc(verificationId).update({
    aiValidation: aiResult,
    status: aiResult.fraudRisk === 'low' ? 'approved' : 'pending_review'
  });

  if (aiResult.fraudRisk === 'low') {
    // This would trigger another flow or action for reward distribution.
    console.log(`AI Validation approved for ${verificationId}. Triggering rewards.`);
  }
}

export const submitValidation = ai.defineFlow(
  {
    name: 'submitValidation',
    inputSchema: SubmitValidationInputSchema,
    outputSchema: SubmitValidationOutputSchema,
  },
  async (input) => {
    const db = ensureFirebaseAdminInitialized();
    const { treeId, photos, measurements, notes } = input;
    // For now, we'll simulate the validator ID. In a real scenario, this would come from the authenticated user context.
    const validatorId = "simulated-validator-uid";

    let hederaClient: Client;
    if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
        hederaClient = Client.forTestnet();
        hederaClient.setOperator(
          process.env.HEDERA_ACCOUNT_ID,
          PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
        );
    } else {
      throw new Error("Hedera client is not initialized. Please check environment variables.");
    }
    
    try {
      const photoHashes = await uploadToIPFS(photos);

      const verificationRef = await db.collection('verifications').add({
        treeId,
        validatorId,
        type: 'growth_check',
        data: {
          photos: photoHashes,
          measurements,
        },
        notes,
        status: 'pending', // Status is pending until AI validation
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      const message = JSON.stringify({
        verificationId: verificationRef.id,
        treeId,
        validator: validatorId,
        timestamp: Date.now()
      });

      const topicId = process.env.HEDERA_TOPIC_ID;
      if (!topicId) {
        throw new Error("HEDERA_TOPIC_ID environment variable is not set.");
      }

      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message);

      const response = await transaction.execute(hederaClient);
      const receipt = await response.getReceipt(hederaClient);

      await verificationRef.update({
        hederaHash: receipt.consensusTimestamp.toString()
      });

      await triggerAIValidation(db, verificationRef.id);

      return {
        success: true,
        verificationId: verificationRef.id,
        message: 'Validation submitted and sent for AI analysis.',
      };
    } catch (error: any) {
      console.error('Validation submission error:', error);
      return {
        success: false,
        message: error.message || 'An internal error occurred during validation submission.',
      };
    }
  }
);
