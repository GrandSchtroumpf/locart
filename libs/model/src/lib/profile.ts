import { Image } from "./media";

export interface Profile {
  type?: 'seller' | 'buyer';
  email: string;
  name: string | null;
  avatar: Image | null;
  tel: string | null;
}