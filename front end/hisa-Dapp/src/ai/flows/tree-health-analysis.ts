'use server';

/**
 * @fileOverview AI tool to analyze the health of registered trees.
 *
 * - analyzeTreeHealth - A function that handles the tree health analysis process.
 * - AnalyzeTreeHealthInput - The input type for the analyzeTreeHealth function.
 * - AnalyzeTreeHealthOutput - The return type for the analyzeTreeHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTreeHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the tree, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  gpsLocation: z.string().describe('GPS coordinates of the tree.'),
  treeDescription: z.string().describe('Description of the tree and its environment.'),
});
export type AnalyzeTreeHealthInput = z.infer<typeof AnalyzeTreeHealthInputSchema>;

const AnalyzeTreeHealthOutputSchema = z.object({
  healthStatus: z.string().describe('Overall health status of the tree (e.g., healthy, needs attention, diseased).'),
  issuesIdentified: z.string().describe('Specific issues identified, if any (e.g., signs of pests, disease, nutrient deficiency).'),
  affectedByNaturalPhenomena: z.string().optional().describe('Whether the tree is affected by any natural phenomena, such as storms and fires.'),
  recommendations: z.string().describe('Recommendations for addressing identified issues.'),
});
export type AnalyzeTreeHealthOutput = z.infer<typeof AnalyzeTreeHealthOutputSchema>;

export async function analyzeTreeHealth(input: AnalyzeTreeHealthInput): Promise<AnalyzeTreeHealthOutput> {
  return analyzeTreeHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTreeHealthPrompt',
  input: {schema: AnalyzeTreeHealthInputSchema},
  output: {schema: AnalyzeTreeHealthOutputSchema},
  prompt: `You are an expert in tree health analysis. Analyze the health of the tree based on the provided information and images.

Description: {{{treeDescription}}}
Photo: {{media url=photoDataUri}}
GPS Location: {{{gpsLocation}}}

Assess the tree's overall health status, identify any issues, determine if it's affected by natural phenomena, and provide recommendations for improvement.
`,
});

const analyzeTreeHealthFlow = ai.defineFlow(
  {
    name: 'analyzeTreeHealthFlow',
    inputSchema: AnalyzeTreeHealthInputSchema,
    outputSchema: AnalyzeTreeHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
