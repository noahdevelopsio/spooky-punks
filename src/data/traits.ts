import { PlaceHolderImages } from '@/lib/placeholder-images';

type TraitOption = {
  id: string;
  label: string;
  url: string;
  imageHint: string;
};

type TraitLayer = {
  zIndex: number;
  label: string;
  options: TraitOption[];
};

const getOptionsFor = (prefix: string) => {
    return PlaceHolderImages.filter(p => p.id.startsWith(prefix)).map(p => ({ 
        id: p.id, 
        label: p.description, 
        url: p.imageUrl, 
        imageHint: p.imageHint 
    }));
}

export const TRAIT_DATA: Record<string, TraitLayer> = {
  Background: {
    zIndex: 10,
    label: 'Background',
    options: getOptionsFor('bg-'),
  },
  Shirt: {
    zIndex: 20,
    label: 'Shirt',
    options: getOptionsFor('shirt-'),
  },
  Head: {
    zIndex: 30,
    label: 'Head',
    options: getOptionsFor('head-'),
  },
  Chain: {
    zIndex: 40,
    label: 'Chain',
    options: getOptionsFor('chain-'),
  },
  Glasses: {
    zIndex: 50,
    label: 'Glasses',
    options: getOptionsFor('glasses-'),
  },
  Cigarette: {
    zIndex: 60,
    label: 'Cigarette',
    options: getOptionsFor('cigarette-'),
  },
};

export const TRAIT_LAYER_NAMES = Object.keys(TRAIT_DATA);
export type SelectedTraits = Record<string, string>;
