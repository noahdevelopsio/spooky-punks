"use server";

import { db } from "@/lib/firebase";
import type { SelectedTraits } from "@/data/traits";
import { collection, addDoc, getDocs, query, serverTimestamp } from "firebase/firestore";

const APP_ID = "spooky-punks";

export async function saveToken(userId: string, recipe: SelectedTraits) {
  if (!userId || !recipe) {
    return { success: false, error: "Invalid user or recipe" };
  }

  try {
    const tokensCollectionRef = collection(db, `artifacts/${APP_ID}/users/${userId}/pumpkin_tokens`);
    
    // Get current token count to generate a name
    const q = query(tokensCollectionRef);
    const querySnapshot = await getDocs(q);
    const tokenCount = querySnapshot.size;
    const tokenName = `Pumpkin Punk #${(tokenCount + 1).toString().padStart(3, '0')}`;

    await addDoc(tokensCollectionRef, {
      name: tokenName,
      recipe: recipe,
      createdAt: serverTimestamp(),
    });

    return { success: true, name: tokenName };
  } catch (error) {
    console.error("Error saving token:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}
