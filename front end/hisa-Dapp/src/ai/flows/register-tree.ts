
'use server';

/**
 * @fileOverview A flow to register a new tree in the Veridi system.
 *
 * - registerTree - A function that handles the tree registration process.
 * - RegisterTreeInput - The input type for the registerTree function.
 * - RegisterTreeOutput - The return type for the registerTree function.
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

const RegisterTreeInputSchema = z.object({
  species: z.object({
    commonName: z.string(),
    scientificName: z.string(),
    type: z.enum(['indigenous', 'exotic', 'medicinal']),
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    altitude: z.number(),
  }),
  cfaId: z.string(),
  nurserySource: z.string(),
  userId: z.string().describe("The ID of the user registering the tree."),
});
export type RegisterTreeInput = z.infer<typeof RegisterTreeInputSchema>;

const RegisterTreeOutputSchema = z.object({
  success: z.boolean(),
  treeId: z.string(),
  message: z.string(),
});
export type RegisterTreeOutput = z.infer<typeof RegisterTreeOutputSchema>;

async function createNotification({ db, type, cfaId, treeId, message }: { db: admin.firestore.Firestore, type: string, cfaId: string, treeId: string, message: string }) {
  // Get all validators in the CFA
  const validatorsSnapshot = await db.collection('users')
    .where('role', '==', 'validator')
    .where('cfaId', '==', cfaId)
    .get();

  if (validatorsSnapshot.empty) {
    console.log(`No validators found for CFA ${cfaId} to notify.`);
    return;
  }
  
  const batch = db.batch();
  validatorsSnapshot.forEach(doc => {
    const notificationRef = db.collection('notifications').doc();
    batch.set(notificationRef, {
      userId: doc.id,
      type,
      title: 'Validation Required',
      message,
      data: { treeId },
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
}

export const registerTree = ai.defineFlow(
  {
    name: 'registerTree',
    inputSchema: RegisterTreeInputSchema,
    outputSchema: RegisterTreeOutputSchema,
  },
  async (input) => {
    const db = ensureFirebaseAdminInitialized();
    const { species, location, cfaId, nurserySource, userId } = input;
    
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
      // Create tree document
      const treeRef = await db.collection('trees').add({
        species,
        planting: {
          plantedBy: userId,
          cfaId,
          date: admin.firestore.FieldValue.serverTimestamp(),
          location,
          nurserySource
        },
        validation: {
          status: 'pending',
          validators: [],
          lastVerified: null,
          nextCheckDue: admin.firestore.Timestamp.fromDate(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          )
        },
        growth: [],
        status: 'growing',
        nftMinted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Submit to Hedera Consensus Service
      const topicId = process.env.HEDERA_TOPIC_ID;
      if(!topicId) {
        throw new Error("HEDERA_TOPIC_ID environment variable is not set.");
      }

      const message = JSON.stringify({
        treeId: treeRef.id,
        action: 'tree_registered',
        location,
        timestamp: Date.now()
      });

      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message);

      const response = await transaction.execute(hederaClient);
      const receipt = await response.getReceipt(hederaClient);

      // Update tree with Hedera topic ID and consensus timestamp
      await treeRef.update({
        hederaTopicId: topicId,
        hederaConsensusTimestamp: receipt.consensusTimestamp.toString()
      });

      // Create notification for validators
      await createNotification({
        db,
        type: 'validation_required',
        cfaId,
        treeId: treeRef.id,
        message: 'New tree planted - verification needed'
      });

      return { 
        success: true, 
        treeId: treeRef.id,
        message: 'Tree registered successfully'
      };

    } catch (error: any) {
      console.error('Tree registration error:', error);
      // It's better to return a structured error than to throw, to conform to the schema
      return {
        success: false,
        treeId: '',
        message: error.message || 'An internal error occurred.'
      };
    }
  }
);
