"use server";

import { initializeServerFirebase, addDocumentNonBlocking } from "@/firebase/server-init";
import type { SelectedTraits } from "@/data/traits";
import { collection, getDocs, query, serverTimestamp } from "firebase/firestore";
import { generatePunk } from "@/ai/flows/generate-punk-flow";

export async function saveToken(userId: string, recipe: SelectedTraits) {
  if (!userId || !recipe) {
    return { success: false, error: "Invalid user or recipe" };
  }

  const { firestore } = initializeServerFirebase();

  try {
    // Generate the punk image first
    const generationResult = await generatePunk({ traits: recipe });
    if (!generationResult.imageUrl) {
        return { success: false, error: "Failed to generate punk image." };
    }

    const tokensCollectionRef = collection(firestore, `users/${userId}/pumpkin_tokens`);
    
    // Get current token count to generate a name
    const q = query(tokensCollectionRef);
    const querySnapshot = await getDocs(q);
    const tokenCount = querySnapshot.size;
    const tokenName = `Pumpkin Punk #${(tokenCount + 1).toString().padStart(3, '0')}`;

    // We use await here because this is a server action and we want to know the result
    // before returning a response to the client.
    await addDocumentNonBlocking(tokensCollectionRef, {
      tokenName: tokenName,
      traitRecipe: recipe,
      forgedAt: serverTimestamp(),
      userId: userId,
      imageUrl: generationResult.imageUrl, // Save the generated image URL
    });

    return { success: true, name: tokenName, imageUrl: generationResult.imageUrl };
  } catch (error) {
    console.error("Error saving token:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
