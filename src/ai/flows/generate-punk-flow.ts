'use server';
/**
 * @fileOverview A Spooky Punk character generation AI flow.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {TRAIT_DATA, type SelectedTraits, TRAIT_LAYER_NAMES} from '@/data/traits';
import {googleAI} from '@genkit-ai/google-genai';

const GeneratePunkInputSchema = z.object({
  traits: z.record(z.string()),
});
export type GeneratePunkInput = z.infer<typeof GeneratePunkInputSchema>;

const GeneratePunkOutputSchema = z.object({
  imageUrl: z.string().url(),
});
export type GeneratePunkOutput = z.infer<typeof GeneratePunkOutputSchema>;

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
    const orderedLayers = TRAIT_LAYER_NAMES;
    
    const textPrompt = `Generate a single, cohesive "Spooky Punk" character portrait in a pixel art style. The character should be a pumpkin-headed figure.
    
    Combine the following traits and styles into one image. Do not show multiple options. The final image should be a single, unified character portrait, not a collage.
    - Style: Pixelated, 8-bit, punk rock aesthetic, single character centered.
    - Character: The main subject is a pumpkin head character.
    - Traits:
      ${orderedLayers.map(layerName => {
        const traitId = traits[layerName];
        if (!traitId) return '';
        const layer = TRAIT_DATA[layerName];
        const trait = layer.options.find(opt => opt.id === traitId);
        return (trait && trait.label !== 'None') ? `  - ${layer.label}: ${trait.label}`: '';
      }).filter(Boolean).join('\n')}

    The background should be visible where not obscured by other layers.
    `;

    const {output} = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: textPrompt, // Only text prompt is sent
      config: {
        // Low safety settings for creative content, adjust if needed
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ]
      },
    });

    let imageUrl = '';

    if (output?.media && output.media.length > 0 && output.media[0].url) {
      imageUrl = output.media[0].url;
    }

    if (!imageUrl) {
      console.error('Image generation output:', JSON.stringify(output, null, 2));
      throw new Error('Image generation failed to produce an image URL.');
    }
    
    return { imageUrl };
  }
);
