
'use server';

import { z } from 'zod';
import { analyzeTreeHealth } from '@/ai/flows/tree-health-analysis';
import type { AnalyzeTreeHealthOutput } from '@/ai/flows/tree-health-analysis';
import { submitValidation } from '@/ai/flows/submit-validation';
import { incrementBalance, getBalance, setBalance } from '@/lib/db';

const GAS_FEE = 0.3;

const fileToDataURI = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${file.type};base64,${buffer.toString('base64')}`;
};

const validationFormSchema = z.object({
  photo: z.instanceof(File).refine((file) => file.size > 0, 'Photo is required.'),
  treeDescription: z.string().min(1, 'Tree description is required.'),
  gpsLocation: z.string().min(1, 'GPS location is required.'),
  walletAccount: z.string().min(1, 'Wallet account is required to mint tokens.'),
});

type ValidationState = {
  data: AnalyzeTreeHealthOutput | null;
  error: string | null;
  success: boolean;
};

export async function handleValidation(prevState: ValidationState, formData: FormData): Promise<ValidationState> {
  try {
    const parsed = validationFormSchema.safeParse({
      photo: formData.get('photo'),
      treeDescription: formData.get('treeDescription'),
      gpsLocation: formData.get('gpsLocation'),
      walletAccount: formData.get('walletAccount'),
    });

    if (!parsed.success) {
      return {
        data: null,
        error: parsed.error.errors.map((e) => e.message).join(', '),
        success: false,
      };
    }

    const { photo, treeDescription, gpsLocation, walletAccount } = parsed.data;

    const currentBalance = getBalance(walletAccount);
    if (currentBalance < GAS_FEE) {
        return {
            data: null,
            error: `Insufficient balance to pay the 0.3 JANI gas fee. Your current balance is ${currentBalance} JANI.`,
            success: false,
        };
    }

    setBalance(walletAccount, currentBalance - GAS_FEE);

    const photoDataUri = await fileToDataURI(photo);

    const result = await analyzeTreeHealth({
      photoDataUri,
      treeDescription,
      gpsLocation,
    });
    
    // If the analysis is successful, simulate minting a token.
    incrementBalance(walletAccount);

    return { data: result, error: null, success: true };
  } catch (error) {
    console.error('Validation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to analyze tree health: ${errorMessage}`, success: false };
  }
}

const verificationFormSchema = z.object({
    treeId: z.string().min(1, 'Tree ID is required.'),
    photos: z.array(z.instanceof(File)).min(1, 'At least one photo is required.'),
    height: z.coerce.number().positive('Height must be positive.'),
    diameter: z.coerce.number().positive('Diameter must be positive.'),
    healthScore: z.coerce.number().min(1).max(10),
    notes: z.string().optional(),
});

type VerificationState = {
    error: string | null;
    success: boolean;
};

export async function handleVerificationSubmit(prevState: VerificationState, formData: FormData): Promise<VerificationState> {
    try {
        const photoFiles = formData.getAll('photos').filter(p => p instanceof File && p.size > 0) as File[];

        const parsed = verificationFormSchema.safeParse({
            treeId: formData.get('treeId'),
            photos: photoFiles,
            height: formData.get('height'),
            diameter: formData.get('diameter'),
            healthScore: formData.get('healthScore'),
            notes: formData.get('notes'),
        });

        if (!parsed.success) {
            return {
                error: parsed.error.errors.map((e) => e.message).join(', '),
                success: false,
            };
        }

        const { treeId, photos, height, diameter, healthScore, notes } = parsed.data;
        
        const photoDataUris = await Promise.all(photos.map(fileToDataURI));

        const result = await submitValidation({
            treeId,
            photos: photoDataUris,
            measurements: {
                height,
                diameter,
                healthScore,
            },
            notes: notes || '',
        });
        
        if (!result.success) {
            return { error: result.message || 'Validation submission failed.', success: false };
        }
        
        return { error: null, success: true };

    } catch (error) {
        console.error('Verification submission error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { error: `Failed to submit verification: ${errorMessage}`, success: false };
    }
}
