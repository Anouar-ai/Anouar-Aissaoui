/**
 * @fileOverview Types for the blog search flow.
 *
 * - BlogSearchWithLlmInput - The input type for the blogSearchWithLlm function.
 * - BlogSearchWithLlmOutput - The return type for the blogSearchWithLlm function.
 */

import {z} from 'genkit';

export const BlogSearchWithLlmInputSchema = z.object({
  query: z.string().describe('The search query to find relevant blog posts.'),
  blogPosts: z.array(z.object({
    title: z.string().describe('The title of the blog post.'),
    pSEODescription: z.string().describe('An AI-generated summary of the blog post content optimized for SEO.'),
    excerpt: z.string().describe('A short excerpt of the blog post.'),
  })).describe('An array of blog posts to search through.'),
});
export type BlogSearchWithLlmInput = z.infer<typeof BlogSearchWithLlmInputSchema>;

export const BlogSearchWithLlmOutputSchema = z.array(z.object({
  title: z.string().describe('The title of the relevant blog post.'),
  excerpt: z.string().describe('A short excerpt of the relevant blog post.'),
  relevanceScore: z.number().describe('The relevance score of the blog post to the search query (0-1).'),
})).describe('An array of relevant blog posts with their relevance scores.');
export type BlogSearchWithLlmOutput = z.infer<typeof BlogSearchWithLlmOutputSchema>;
