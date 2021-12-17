import { Injectable } from "@angular/core"; 
import { Painting } from "@locart/model";
import { FireCollection } from "ngfire";


@Injectable({ providedIn: 'root' })
export class PaintingService extends FireCollection<Painting> {
  readonly path = 'paintings';
  readonly memorize = true;
}