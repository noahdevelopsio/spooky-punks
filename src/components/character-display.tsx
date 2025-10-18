"use client";

import Image from "next/image";
import { TRAIT_DATA, type SelectedTraits } from "@/data/traits";
import { Skeleton } from "@/components/ui/skeleton";

type CharacterDisplayProps = {
  selectedTraits: SelectedTraits | null;
};

export default function CharacterDisplay({ selectedTraits }: CharacterDisplayProps) {
  const layers = Object.entries(TRAIT_DATA).map(([layerName, layerData]) => {
    const traitId = selectedTraits?.[layerName];
    if (!traitId) return null;

    const trait = layerData.options.find((opt) => opt.id === traitId);
    if (!trait || !trait.url) return null;

    return {
      ...trait,
      zIndex: layerData.zIndex,
    };
  }).filter(Boolean);

  return (
    <div className="relative aspect-square w-full max-w-[512px] bg-secondary/50 rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
      {selectedTraits ? (
        layers.map((layer) => (
          <Image
            key={layer.id}
            src={layer.url}
            alt={layer.label}
            fill
            priority
            unoptimized // For picsum, to avoid caching issues with same seed
            className="pixelated absolute inset-0"
            style={{ zIndex: layer.zIndex }}
            data-ai-hint={layer.imageHint}
          />
        ))
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}
