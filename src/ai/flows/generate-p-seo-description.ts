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
  
  Blog Post Content:
  ---
  {{{content}}}
  ---
  
  Generate the SEO-optimized summary.`,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
    ]
  }
});

const generatePSEODescriptionFlow = ai.defineFlow(
  {
    name: 'generatePSEODescriptionFlow',
    inputSchema: GeneratePSEODescriptionInputSchema,
    outputSchema: GeneratePSEODescriptionOutputSchema,
  },
  async (input) => {
    // Strip HTML tags and truncate to prevent token limit errors
    const processedContent = input.content.replace(/<[^>]*>?/gm, '').substring(0, 4000);

    const {output} = await pSEODescriptionPrompt({
        title: input.title,
        content: processedContent
    });
    return output!;
  }
);
