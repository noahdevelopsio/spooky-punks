"use client";

import { useState, useEffect, useCallback } from "react";
import { signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { TRAIT_DATA, TRAIT_LAYER_NAMES, type SelectedTraits } from "@/data/traits";
import { saveToken } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/header";
import CharacterDisplay from "@/components/character-display";
import CustomizationControls from "@/components/customization-controls";
import SavedTokensList, { type Token } from "@/components/saved-tokens-list";

export default function SpookyPunksPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits | null>(null);
  const [savedTokens, setSavedTokens] = useState<Token[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const randomizeCharacter = useCallback(() => {
    const randomTraits: SelectedTraits = {};
    TRAIT_LAYER_NAMES.forEach((layerName) => {
      const layer = TRAIT_DATA[layerName];
      const randomIndex = Math.floor(Math.random() * layer.options.length);
      randomTraits[layerName] = layer.options[randomIndex].id;
    });
    setSelectedTraits(randomTraits);
  }, []);

  useEffect(() => {
    if(!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          toast({ variant: "destructive", title: "Connection Failed", description: "Could not connect to the service." });
        });
      }
    });
    return () => unsubscribe();
  }, [toast]);

  useEffect(() => {
    randomizeCharacter();
  }, [randomizeCharacter]);

  useEffect(() => {
    if (!user || !db) return;

    const APP_ID = "spooky-punks";
    const tokensPath = `artifacts/${APP_ID}/users/${user.uid}/pumpkin_tokens`;
    const q = query(collection(db, tokensPath), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tokens: Token[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tokens.push({
          id: doc.id,
          name: data.name,
          recipe: data.recipe,
        });
      });
      setSavedTokens(tokens);
    }, (error) => {
      console.error("Error fetching saved tokens:", error);
      toast({ variant: "destructive", title: "Sync Error", description: "Could not fetch your saved Punks." });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleTraitChange = (layer: string, traitId: string) => {
    setSelectedTraits((prev) => (prev ? { ...prev, [layer]: traitId } : null));
  };

  const handleForgeToken = async () => {
    if (!user || !selectedTraits) {
      toast({ variant: "destructive", title: "Error", description: "Cannot save token. User or traits not ready." });
      return;
    }
    setIsSaving(true);
    const result = await saveToken(user.uid, selectedTraits);
    if (result.success) {
      toast({ title: "Punk Forged!", description: `Your token "${result.name}" has been saved.` });
    } else {
      toast({ variant: "destructive", title: "Forge Failed", description: result.error });
    }
    setTimeout(() => setIsSaving(false), 1000); // Brief disable
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={user?.uid ?? null} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center gap-8">
            <CharacterDisplay selectedTraits={selectedTraits} />
            <div className="w-full">
              <SavedTokensList tokens={savedTokens} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <CustomizationControls
              selectedTraits={selectedTraits}
              onTraitChange={handleTraitChange}
              onRandomize={randomizeCharacter}
              onForge={handleForgeToken}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
