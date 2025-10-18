"use client";

import { TRAIT_DATA, type SelectedTraits } from "@/data/traits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export type Token = {
  id: string;
  name: string;
  recipe: SelectedTraits;
};

type SavedTokensListProps = {
  tokens: Token[];
};

export default function SavedTokensList({ tokens }: SavedTokensListProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary font-headline">My Punks</CardTitle>
        <CardDescription>Your collection of forged Spooky Punks.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full">
          <div className="space-y-4 pr-6">
            {tokens.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">You have no Punks yet. Forge one!</p>
            ) : (
              tokens.map((token) => (
                <div key={token.id} className="p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-200">{token.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(token.recipe).map(([layer, traitId]) => {
                      const trait = TRAIT_DATA[layer]?.options.find(o => o.id === traitId);
                      if (!trait || trait.label === 'None') return null;
                      return (
                        <Badge key={layer} variant="secondary" className="bg-accent/20 text-accent-foreground">
                          <span className="font-normal opacity-70 mr-1.5">{TRAIT_DATA[layer].label}:</span> {trait.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
