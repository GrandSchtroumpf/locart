import { Image } from './media';

export const paintingSizes = [1, 2, 3, 4] as const;
export const paintingStyles = [
  'modernism',
  'impressionism',
  'abstract',
  'expressionism',
  'cubism',
  'surrealism',
];
export const paintingTypes = [
  'oil',
  'acrylic',
  'pencil',
  'watercolor',
  'charcoal',
  'spray',
  'gouache',
  'digital',
  'pastel',
  'ink',
  'collage'
];

export type PaintingSize = typeof paintingSizes[number];
export type PaintingStyle = typeof paintingStyles[number];
export type PaintingType = typeof paintingTypes[number];

export interface Painting {
  id: string;
  path: string;
  image: Image;
  carousel: Image[];
  title: string;
  size: PaintingSize;
  style: PaintingStyle;
  type: PaintingType;
  color: string;
}