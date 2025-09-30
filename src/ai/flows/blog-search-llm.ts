'use server';
/**
 * @fileOverview Blog post search flow using LLM to determine relevancy.
 *
 * - blogSearchWithLlm - A function that searches blog posts using keywords and LLM.
 * - BlogSearchWithLlmInput - The input type for the blogSearchWithLlm function.
 * - BlogSearchWithLlmOutput - The return type for the blogSearchWithLlm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlogSearchWithLlmInputSchema = z.object({
  query: z.string().describe('The search query to find relevant blog posts.'),
  blogPosts: z.array(z.object({
    title: z.string().describe('The title of the blog post.'),
    pSEODescription: z.string().describe('An AI-generated summary of the blog post content optimized for SEO.'),
    excerpt: z.string().describe('A short excerpt of the blog post.'),
  })).describe('An array of blog posts to search through.'),
});
export type BlogSearchWithLlmInput = z.infer<typeof BlogSearchWithLlmInputSchema>;

const BlogSearchWithLlmOutputSchema = z.array(z.object({
  title: z.string().describe('The title of the relevant blog post.'),
  excerpt: z.string().describe('A short excerpt of the relevant blog post.'),
  relevanceScore: z.number().describe('The relevance score of the blog post to the search query (0-1).'),
})).describe('An array of relevant blog posts with their relevance scores.');
export type BlogSearchWithLlmOutput = z.infer<typeof BlogSearchWithLlmOutputSchema>;

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
