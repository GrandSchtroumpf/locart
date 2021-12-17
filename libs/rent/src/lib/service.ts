import { Injectable } from "@angular/core"; 
import { Rent } from "@locart/model";
import { FireCollection } from "ngfire";


@Injectable({ providedIn: 'root' })
export class RentService extends FireCollection<Rent> {
  readonly path = 'rents';
  readonly memorize = true;
}