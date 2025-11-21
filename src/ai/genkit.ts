import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      projectId: 'spooky-punks',
      location: 'us-central1',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
