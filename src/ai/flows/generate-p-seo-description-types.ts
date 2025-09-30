/**
 * @fileOverview Types for the pSEO description generation flow.
 *
 * - GeneratePSEODescriptionInput - The input type for the generatePSEODescription function.
 * - GeneratePSEODescriptionOutput - The return type for the generatePSEODescription function.
 */

import {z} from 'genkit';

export const GeneratePSEODescriptionInputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z.string().describe('The full HTML content of the blog post.'),
});
export type GeneratePSEODescriptionInput = z.infer<typeof GeneratePSEODescriptionInputSchema>;

export const GeneratePSEODescriptionOutputSchema = z.object({
    pSEODescription: z.string().describe('A concise, SEO-optimized summary of the blog post, under 160 characters.')
});
export type GeneratePSEODescriptionOutput = z.infer<typeof GeneratePSEODescriptionOutputSchema>;
