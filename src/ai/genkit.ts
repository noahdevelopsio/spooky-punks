import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [
    googleAI(),
    vertexAI({
      projectId: 'studio-4654518983-f5fb5',
      location: 'us-central1',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
