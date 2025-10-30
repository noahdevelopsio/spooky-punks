"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { 
  useFirebase,
  useUser, 
  useCollection,
  initiateAnonymousSignIn, 
  addDocumentNonBlocking,
  useMemoFirebase,
} from "@/firebase";
import { TRAIT_DATA, TRAIT_LAYER_NAMES, type SelectedTraits } from "@/data/traits";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/header";
import CharacterDisplay from "@/components/character-display";
import CustomizationControls from "@/components/customization-controls";
import SavedTokensList, { type Token } from "@/components/saved-tokens-list";

export default function SpookyPunksPage() {
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits | null>(null);
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
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    randomizeCharacter();
  }, [randomizeCharacter]);

  const tokensQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/pumpkin_tokens`), orderBy("forgedAt", "desc"));
  }, [user, firestore]);

  const { data: savedTokens, isLoading: areTokensLoading } = useCollection<Token>(tokensQuery);

  const handleTraitChange = (layer: string, traitId: string) => {
    setSelectedTraits((prev) => (prev ? { ...prev, [layer]: traitId } : null));
  };

  const handleForgeToken = async () => {
    if (!user || !selectedTraits || !firestore) {
      toast({ variant: "destructive", title: "Error", description: "Cannot save token. User or traits not ready." });
      return;
    }
    setIsSaving(true);
    
    try {
      const tokensCollectionRef = collection(firestore, `users/${user.uid}/pumpkin_tokens`);
      const tokenCount = savedTokens?.length ?? 0;
      const tokenName = `Pumpkin Punk #${(tokenCount + 1).toString().padStart(3, '0')}`;

      addDocumentNonBlocking(tokensCollectionRef, {
        tokenName: tokenName,
        traitRecipe: selectedTraits,
        forgedAt: new Date(),
        userId: user.uid,
      });

      toast({ title: "Punk Forged!", description: `Your token "${tokenName}" has been saved.` });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: "Forge Failed", description: errorMessage });
    } finally {
      setTimeout(() => setIsSaving(false), 1000); // Brief disable
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={user?.uid ?? null} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center gap-8">
            <CharacterDisplay selectedTraits={selectedTraits} />
            <div className="w-full">
              <SavedTokensList tokens={savedTokens || []} />
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
