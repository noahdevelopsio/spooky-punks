# **App Name**: Spooky Punks

## Core Features:

- Firebase Initialization & Auth: Initialize Firebase services and authenticate the user using the provided token or anonymously, storing the userId.
- Generative Trait Data (Mock Firestore Read): Implement a hardcoded TRAIT_DATA object representing the result of a Firestore read for pumpkin traits.
- Character Generation & Display: Generate a composite character image using absolutely-positioned <img> tags based on selected traits. Load a random character on page load.
- Customization Controls (UI): Generate dropdown controls for each trait layer and a 'Randomize' button to update the character image.
- Token Saving (Firestore Write): Implement a 'Forge Token' button to save the selected traits to the user's private Firestore collection.
- Saved Tokens List (Real-Time Read): Use an onSnapshot listener to render a real-time list of the user's saved tokens.

## Style Guidelines:

- Primary color: Neon orange (#FF6700) for a vibrant, crypto-themed feel.
- Background color: Dark grey (#121212) to provide a high-contrast base, common in crypto/NFT interfaces.
- Accent color: Purple (#A020F0) to complement the orange and enhance the Halloween theme.
- Body and headline font: 'Space Grotesk' sans-serif for a computerized and modern look that fits the NFT aesthetic. Note: currently only Google Fonts are supported.
- Pixelated icons to maintain the retro and spooky theme.
- Use Tailwind CSS for a clear, structured layout with rounded corners. Implement clear sections for character generation, customization controls, and saved tokens.
- Subtle animations for button interactions and token generation.