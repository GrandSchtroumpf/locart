export const paintingSizes = [1, 2, 3, 4] as const;

export interface Painting {
  id: string;
  path: string;
  image: string;
  carousel: string[];
  name: string;
  size: typeof paintingSizes[number];
  color: string;
  material: string;
}