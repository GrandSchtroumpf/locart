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

export interface Painting {
  id: string;
  path: string;
  image: string;
  carousel: string[];
  title: string;
  size: typeof paintingSizes[number];
  style: typeof paintingStyles[number];
  type: typeof paintingTypes[number];
  color: string;
}