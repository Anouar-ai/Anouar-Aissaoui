'use server';
/**
 * @fileOverview A flow to generate a programmatic SEO description for a blog post.
 *
 * - generatePSEODescription - A function that creates a concise, SEO-optimized summary of a blog post.
 */

import {ai} from '@/ai/genkit';
import {
    GeneratePSEODescriptionInput,
    GeneratePSEODescriptionInputSchema,
    GeneratePSEODescriptionOutput,
    GeneratePSEODescriptionOutputSchema
} from './generate-p-seo-description-types';


export async function generatePSEODescription(input: GeneratePSEODescriptionInput): Promise<GeneratePSEODescriptionOutput> {
  return generatePSEODescriptionFlow(input);
}

const pSEODescriptionPrompt = ai.definePrompt({
  name: 'pSEODescriptionPrompt',
  input: {schema: GeneratePSEODescriptionInputSchema},
  output: {schema: GeneratePSEODescriptionOutputSchema},
  prompt: `You are an SEO expert. Your task is to generate a concise, SEO-optimized summary for a blog post based on its title and content.
  
  The summary should be engaging, informative, and under 160 characters to work well as a meta description.
  It should capture the main topic and purpose of the blog post.
  
  Blog Post Title: {{{title}}}
  
  Blog Post Content (HTML):
  ---
  {{{content}}}
  ---
  
  Generate the SEO-optimized summary.`,
});

const generatePSEODescriptionFlow = ai.defineFlow(
  {
    name: 'generatePSEODescriptionFlow',
    inputSchema: GeneratePSEODescriptionInputSchema,
    outputSchema: GeneratePSEODescriptionOutputSchema,
  },
  async (input) => {
    // Strip HTML tags from content to provide cleaner text to the model
    const strippedContent = input.content.replace(/<[^>]*>?/gm, '');

    const {output} = await pSEODescriptionPrompt({
        title: input.title,
        content: strippedContent
    });
    return output!;
  }
);
