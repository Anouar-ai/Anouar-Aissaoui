// This is an AI-powered product recommendation agent.
//
// - aiProductRecommendations - A function that suggests related products based on the items in the user's cart.
// - AiProductRecommendationsInput - The input type for the aiProductRecommendations function, which is an array of product names.
// - AiProductRecommendationsOutput - The return type for the aiProductRecommendations function, which is an array of recommended product names.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiProductRecommendationsInputSchema = z.object({
  productNames: z
    .array(z.string())
    .describe('The names of the products currently in the cart.'),
});
export type AiProductRecommendationsInput = z.infer<typeof AiProductRecommendationsInputSchema>;

const AiProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('The names of the products recommended to the user.'),
});
export type AiProductRecommendationsOutput = z.infer<typeof AiProductRecommendationsOutputSchema>;

export async function aiProductRecommendations(input: AiProductRecommendationsInput): Promise<AiProductRecommendationsOutput> {
  return aiProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProductRecommendationsPrompt',
  input: {schema: AiProductRecommendationsInputSchema},
  output: {schema: AiProductRecommendationsOutputSchema},
  prompt: `You are a shopping assistant. Given a list of products in the user's cart, suggest other products that the user may be interested in buying.

  Only suggest new products if there are at least two items in the cart.  Otherwise the cart may be too new for recommendations to be relevant.

  Products in cart:
  {{#each productNames}}
  - {{this}}
  {{/each}}
  `,
});

const aiProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiProductRecommendationsFlow',
    inputSchema: AiProductRecommendationsInputSchema,
    outputSchema: AiProductRecommendationsOutputSchema,
  },
  async input => {
    if (input.productNames.length < 2) {
      return {recommendedProducts: []};
    }
    const {output} = await prompt(input);
    return output!;
  }
);
