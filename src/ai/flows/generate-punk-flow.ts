'use server';
/**
 * @fileOverview A Spooky Punk character generation AI flow.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {TRAIT_DATA, type SelectedTraits, TRAIT_LAYER_NAMES} from '@/data/traits';
import type {MediaPart} from 'genkit/model';
import fetch from 'node-fetch';

const GeneratePunkInputSchema = z.object({
  traits: z.record(z.string()),
});
export type GeneratePunkInput = z.infer<typeof GeneratePunkInputSchema>;

const GeneratePunkOutputSchema = z.object({
  imageUrl: z.string().url(),
});
export type GeneratePunkOutput = z.infer<typeof GeneratePunkOutputSchema>;

async function urlToDataUri(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.statusText}`);
      return null;
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting URL to data URI:', error);
    return null;
  }
}

export async function generatePunk(
  input: GeneratePunkInput
): Promise<GeneratePunkOutput> {
  return generatePunkFlow(input);
}

const generatePunkFlow = ai.defineFlow(
  {
    name: 'generatePunkFlow',
    inputSchema: GeneratePunkInputSchema,
    outputSchema: GeneratePunkOutputSchema,
  },
  async ({traits}) => {
    const traitDescriptions: string[] = [];
    const orderedLayers = TRAIT_LAYER_NAMES;

    for (const layerName of orderedLayers) {
      const traitId = traits[layerName];
      if (!traitId) continue;
      
      const layer = TRAIT_DATA[layerName];
      const trait = layer.options.find(opt => opt.id === traitId);

      if (trait && trait.label !== 'None') {
        traitDescriptions.push(`${layer.label}: ${trait.label}`);
      }
    }
    
    const textPrompt = `Generate a single, cohesive "Spooky Punk" character portrait in a pixel art style. The character should be a pumpkin-headed figure.
    
    Combine the following traits and styles into one image. Do not show multiple options.
    - Style: Pixelated, 8-bit, punk rock aesthetic, single character centered.
    - Character: The main subject is a pumpkin head character.
    - Traits to include: ${traitDescriptions.join(', ')}.

    The final image should be a single, unified character, not a collage. The background should be visible where not obscured by other layers.
    `;

    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: textPrompt,
      config: {
        responseModalities: ['IMAGE'],
        // Low safety settings for creative content, adjust if needed
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ]
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }
    
    return { imageUrl: media.url };
  }
);
