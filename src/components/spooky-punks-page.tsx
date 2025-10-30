"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { 
  useFirebase,
  useUser, 
  useCollection,
  initiateAnonymousSignIn, 
  useMemoFirebase,
} from "@/firebase";
import { TRAIT_DATA, TRAIT_LAYER_NAMES, type SelectedTraits } from "@/data/traits";
import { useToast } from "@/hooks/use-toast";
import { saveToken } from "@/app/actions";

import Header from "@/components/header";
import CharacterDisplay from "@/components/character-display";
import CustomizationControls from "@/components/customization-controls";
import SavedTokensList, { type Token } from "@/components/saved-tokens-list";

export default function SpookyPunksPage() {
  const { auth, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const randomizeCharacter = useCallback(() => {
    const randomTraits: SelectedTraits = {};
    TRAIT_LAYER_NAMES.forEach((layerName) => {
      const layer = TRAIT_DATA[layerName];
      const randomIndex = Math.floor(Math.random() * layer.options.length);
      randomTraits[layerName] = layer.options[randomIndex].id;
    });
    setSelectedTraits(randomTraits);
    setGeneratedImageUrl(null); // Clear previous image on randomize
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

  const { data: savedTokens } = useCollection<Token>(tokensQuery);

  const handleTraitChange = (layer: string, traitId: string) => {
    setSelectedTraits((prev) => {
      const newTraits = prev ? { ...prev, [layer]: traitId } : null;
      if (JSON.stringify(prev) !== JSON.stringify(newTraits)) {
        setGeneratedImageUrl(null); // Clear image if traits change
      }
      return newTraits;
    });
  };

  const handleForgeToken = async () => {
    if (!user || !selectedTraits) {
      toast({ variant: "destructive", title: "Error", description: "Cannot forge token. User or traits not ready." });
      return;
    }
    
    startSaving(async () => {
      setGeneratedImageUrl(null);
      const result = await saveToken(user.uid, selectedTraits);
      if (result.success && result.name && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        toast({ title: "Punk Forged!", description: `Your token "${result.name}" has been saved.` });
      } else {
        toast({ variant: "destructive", title: "Forge Failed", description: result.error || "An unknown error occurred." });
        setGeneratedImageUrl(null);
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={user?.uid ?? null} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col items-center gap-8">
            <CharacterDisplay imageUrl={generatedImageUrl} isGenerating={isSaving} />
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
