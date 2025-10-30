"use server";

import { initializeFirebase, addDocumentNonBlocking } from "@/firebase";
import type { SelectedTraits } from "@/data/traits";
import { collection, getDocs, query, serverTimestamp } from "firebase/firestore";

export async function saveToken(userId: string, recipe: SelectedTraits) {
  if (!userId || !recipe) {
    return { success: false, error: "Invalid user or recipe" };
  }

  const { firestore } = initializeFirebase();

  try {
    const tokensCollectionRef = collection(firestore, `users/${userId}/pumpkin_tokens`);
    
    // Get current token count to generate a name
    const q = query(tokensCollectionRef);
    const querySnapshot = await getDocs(q);
    const tokenCount = querySnapshot.size;
    const tokenName = `Pumpkin Punk #${(tokenCount + 1).toString().padStart(3, '0')}`;

    addDocumentNonBlocking(tokensCollectionRef, {
      tokenName: tokenName,
      traitRecipe: recipe,
      forgedAt: serverTimestamp(),
      userId: userId,
    });

    return { success: true, name: tokenName };
  } catch (error) {
    console.error("Error saving token:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
