"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2 } from "lucide-react";

type CharacterDisplayProps = {
  imageUrl: string | null;
  isGenerating: boolean;
};

export default function CharacterDisplay({ imageUrl, isGenerating }: CharacterDisplayProps) {
  return (
    <div className="relative aspect-square w-full max-w-[512px] bg-secondary/50 rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
      {isGenerating ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-primary-foreground">
            <Wand2 className="h-12 w-12 animate-pulse text-primary" />
            <p className="font-headline text-lg">Forging your Punk...</p>
            <p className="text-sm text-muted-foreground">This can take a moment.</p>
        </div>
      ) : imageUrl ? (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt="Generated Spooky Punk"
            fill
            priority
            className="pixelated absolute inset-0"
            data-ai-hint="spooky punk"
          />
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}
