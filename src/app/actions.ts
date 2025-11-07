
'use server';

import { suggestSalesTargets, type SuggestSalesTargetsInput, type SuggestSalesTargetsOutput } from "@/ai/flows/suggest-sales-targets";
import { revalidatePath } from "next/cache";

export type AIFormState = {
  success: boolean;
  data: SuggestSalesTargetsOutput | null;
  error: string | null;
  timestamp: number;
} | null;

export async function getAiSuggestion(
  prevState: AIFormState,
  formData: FormData
): Promise<AIFormState> {
  const currentSalesTarget = parseInt(formData.get('salesTarget') as string, 10);
  const marketBenchmarkData = formData.get('marketBenchmark') as string;
  const currentStage = formData.get('currentStage') as string;
  
  if (!currentSalesTarget || !marketBenchmarkData || !currentStage) {
    return {
      success: false,
      data: null,
      error: 'Invalid input. Please ensure all fields are filled.',
      timestamp: Date.now(),
    };
  }

  try {
    const input: SuggestSalesTargetsInput = {
      currentSalesTarget,
      marketBenchmarkData,
      currentStage,
    };
    
    const result = await suggestSalesTargets(input);

    revalidatePath('/');
    return {
      success: true,
      data: result,
      error: null,
      timestamp: Date.now(),
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      data: null,
      error: 'An unexpected error occurred while contacting the AI. Please try again later.',
      timestamp: Date.now(),
    };
  }
}
