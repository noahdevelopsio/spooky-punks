"use client";

import { Wand2, Dices } from "lucide-react";
import { TRAIT_DATA, type SelectedTraits, TRAIT_LAYER_NAMES } from "@/data/traits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CustomizationControlsProps = {
  selectedTraits: SelectedTraits | null;
  onTraitChange: (layer: string, traitId: string) => void;
  onRandomize: () => void;
  onForge: () => void;
  isSaving: boolean;
};

export default function CustomizationControls({
  selectedTraits,
  onTraitChange,
  onRandomize,
  onForge,
  isSaving,
}: CustomizationControlsProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary font-headline">Customize</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          {TRAIT_LAYER_NAMES.map((layerName) => {
            const layer = TRAIT_DATA[layerName];
            return (
              <div key={layerName} className="grid gap-2">
                <Label htmlFor={`select-${layerName}`}>{layer.label}</Label>
                <Select
                  value={selectedTraits?.[layerName] || ""}
                  onValueChange={(value) => onTraitChange(layerName, value)}
                  disabled={!selectedTraits}
                >
                  <SelectTrigger id={`select-${layerName}`} className="w-full">
                    <SelectValue placeholder={`Select ${layer.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {layer.options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onRandomize} disabled={isSaving}>
            <Dices className="mr-2 h-4 w-4" />
            Randomize
          </Button>
          <Button
            onClick={onForge}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isSaving ? "Forging..." : "Forge Token"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
