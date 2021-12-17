import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Painting, PaintingSize, paintingSizes, PaintingStyle, paintingStyles, PaintingType, paintingTypes, Rent, Duration } from '@locart/model';
import { PaintingService } from '@locart/painting';
import { DurationForm, RentService } from '@locart/rent';
import { FormEntity, trackById } from '@locart/utils';
import { orderBy, startAt, where } from 'firebase/firestore';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface PaintingSearch {
  size: PaintingSize[];
  styles: PaintingStyle[];
  types: PaintingType[];
  color: string;
  duration: Duration;
}

class SearchForm extends FormEntity<PaintingSearch> {
  constructor(search: Partial<PaintingSearch> = {}) {
    super({
      size: new FormControl(search.size),
      styles: new FormControl(search.styles ?? []),
      types: new FormControl(search.types ?? []),
      color: new FormControl(search.color),
      duration: new DurationForm(),
    }, { updateOn: 'blur' })
  }
}

function includesField<T, K extends keyof T>(value: T, field: K, search?: T[K][]) {
  if (!search?.length) return true;
  return search.includes(value[field]);
}

function notInRent(painting: Painting, rents: Rent[], duration?: Duration) {
  if (!duration) return true;
  return rents.filter(rent => rent.workId === painting.id)
    .every(rent => duration.to < rent.duration.from || duration.from > rent.duration.to);
}

function filterPaintings(paintings: Painting[], rents: Rent[], search: Partial<PaintingSearch> = {}) {
  return paintings.filter(painting => {
    if (!includesField(painting, 'size', search.size)) return false;
    if (!includesField(painting, 'style', search.styles)) return false;
    if (!includesField(painting, 'type', search.types)) return false;
    return notInRent(painting, rents, search.duration);
  })
}

@Component({
  selector: 'la-painting-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingListComponent {
  form = new SearchForm();
  rent$ = this.rentService.valueChanges([
    where('type', '==', 'painting'),
    orderBy('duration.to', 'asc'),
    startAt(new Date())
  ]).pipe(
    startWith([])
  )

  paintings$ = combineLatest([
    this.service.valueChanges(),
    this.rent$,
    this.form.value$
  ]).pipe(
    map(([paintings, rents, search]) => filterPaintings(paintings, rents, search))
  );

  readonly sizes = paintingSizes;
  readonly styles = paintingStyles;
  readonly types = paintingTypes;
  
  trackById = trackById;
  dateFilter = (date: Date | null) => date ? date > new Date() : false;
  
  constructor(
    private service: PaintingService,
    private rentService: RentService
  ) { }

}
