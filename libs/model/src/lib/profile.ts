import { Image } from "./media";

export interface Profile {
  isSeller: boolean;
  email: string;
  name: string | null;
  avatar: Image | null;
  tel: string | null;
}