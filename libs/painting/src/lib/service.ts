import { Injectable } from "@angular/core"; 
import { Painting } from "@locart/model";
import { FireSubCollection } from "ngfire";


@Injectable({ providedIn: 'root' })
export class PaintingService extends FireSubCollection<Painting> {
  readonly path = 'users/:userId/paintings';
}