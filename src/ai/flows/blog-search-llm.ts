'use server';
/**
 * @fileOverview Blog post search flow using LLM to determine relevancy.
 *
 * - blogSearchWithLlm - A function that searches blog posts using keywords and LLM.
 */

import {ai} from '@/ai/genkit';
import {
  BlogSearchWithLlmInput,
  BlogSearchWithLlmInputSchema,
  BlogSearchWithLlmOutput,
  BlogSearchWithLlmOutputSchema
} from './blog-search-llm-types';

export async function blogSearchWithLlm(input: BlogSearchWithLlmInput): Promise<BlogSearchWithLlmOutput> {
  return blogSearchWithLlmFlow(input);
}

const blogSearchPrompt = ai.definePrompt({
  name: 'blogSearchPrompt',
  input: {schema: BlogSearchWithLlmInputSchema},
  output: {schema: BlogSearchWithLlmOutputSchema},
  prompt: `You are a search assistant that determines the relevance of blog posts to a given search query.

  For each blog post, you should determine a relevance score between 0 and 1, where 1 is highly relevant and 0 is not relevant.
  Return an array of blog posts with their title, excerpt, and relevance score to the query.

  Prioritize the pSEODescription for relevance, but also consider the title and excerpt.

  Search Query: {{{query}}}

  Blog Posts:
  {{#each blogPosts}}
  Title: {{{this.title}}}
  Excerpt: {{{this.excerpt}}}
  pSEODescription: {{{this.pSEODescription}}}
  ---
  {{/each}}
  `,
});

const blogSearchWithLlmFlow = ai.defineFlow(
  {
    name: 'blogSearchWithLlmFlow',
    inputSchema: BlogSearchWithLlmInputSchema,
    outputSchema: BlogSearchWithLlmOutputSchema,
  },
  async input => {
    const {output} = await blogSearchPrompt(input);
    return output!;
  }
);
