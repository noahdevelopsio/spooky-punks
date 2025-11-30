# Spooky Punks

Welcome to **Spooky Punks**, a generative art application where you can design, create, and collect your own unique, Halloween-themed punk characters using the power of AI.

## 🎃 Features

*   **Customize Your Punk**: Mix and match a variety of traits, including different heads, shirts, accessories, and backgrounds.
*   **AI-Powered Generation**: Watch your creation come to life! The app uses a generative AI model (Gemini) to forge a unique, pixel-art style character based on your selected traits.
*   **Forge & Collect**: Save your favorite generated punks. Each forged punk is stored as a "token" in your personal collection, backed by Firestore.
*   **Anonymous Authentication**: No need to create an account. The app uses Firebase Anonymous Authentication to give each user a unique ID and a private collection.
*   **Real-time Updates**: Your collection of saved punks updates in real-time.

## 🛠️ Tech Stack

This project is built with a modern web stack:

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Generative AI**: [Google's Gemini model](https://deepmind.google/technologies/gemini/) via [Genkit](https://firebase.google.com/docs/genkit)
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication and Firestore)
