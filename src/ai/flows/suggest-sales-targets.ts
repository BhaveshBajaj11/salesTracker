'use server';

/**
 * @fileOverview AI agent to suggest sales targets based on market benchmarks.
 *
 * - suggestSalesTargets - A function that suggests revised sales targets.
 * - SuggestSalesTargetsInput - The input type for the suggestSalesTargets function.
 * - SuggestSalesTargetsOutput - The return type for the suggestSalesTargets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSalesTargetsInputSchema = z.object({
  currentSalesTarget: z
    .number()
    .describe('The current sales target set by the user.'),
  marketBenchmarkData: z
    .string()
    .describe(
      'Market benchmark data for similar products or services.  Include industry, sales data, and region.'
    ),
  currentStage: z
    .string()
    .describe(
      'The current sales stage (Red, Blue, Yellow, Green) based on current sales figures.'
    ),
});
export type SuggestSalesTargetsInput = z.infer<typeof SuggestSalesTargetsInputSchema>;

const SuggestSalesTargetsOutputSchema = z.object({
  revisedSalesTarget: z
    .number()
    .describe('The revised sales target suggested by the AI.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the revised sales target, based on market benchmarks.'
    ),
  suggestedStageRanges: z
    .string()
    .describe(
      'The suggested sales ranges for each stage (Red, Blue, Yellow, Green) in JSON format.'
    ),
});
export type SuggestSalesTargetsOutput = z.infer<typeof SuggestSalesTargetsOutputSchema>;

export async function suggestSalesTargets(
  input: SuggestSalesTargetsInput
): Promise<SuggestSalesTargetsOutput> {
  return suggestSalesTargetsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSalesTargetsPrompt',
  input: {schema: SuggestSalesTargetsInputSchema},
  output: {schema: SuggestSalesTargetsOutputSchema},
  prompt: `You are an AI sales analyst, specializing in sales targets and market analysis.

You will receive the current sales target, market benchmark data, and the current sales stage.

Based on the market benchmark data, you will suggest a revised sales target if the current target is unrealistic.

Consider whether the current sales target is achievable given the provided market benchmark data.

Market Benchmark Data: {{{marketBenchmarkData}}}
Current Sales Target: {{{currentSalesTarget}}}
Current Sales Stage: {{{currentStage}}}

Reasoning: Explain your reasoning for suggesting a revised sales target, and how it aligns with market benchmarks.

Finally, suggest new ranges for each stage using JSON, incorporating insights from the market benchmarks.  Always provide a complete JSON object, even if you are simply re-stating the initial ranges.

Output the revised sales target, reasoning, and suggested stage ranges in the following JSON format:

{
  "revisedSalesTarget": "...",
  "reasoning": "...",
  "suggestedStageRanges": "{\"Red\": \"0-1000\", \"Blue\": \"1001-1500\", \"Yellow\": \"1501-2500\", \"Green\": \">2500\"}"
}
`,
});

const suggestSalesTargetsFlow = ai.defineFlow(
  {
    name: 'suggestSalesTargetsFlow',
    inputSchema: SuggestSalesTargetsInputSchema,
    outputSchema: SuggestSalesTargetsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
