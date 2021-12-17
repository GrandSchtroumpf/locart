import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Painting, PaintingSize, paintingSizes, PaintingStyle, paintingStyles, PaintingType, paintingTypes } from '@locart/model';
import { PaintingService } from '@locart/painting';
import { FormEntity, trackById } from '@locart/utils';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface PaintingSearch {
  size: PaintingSize[];
  styles: PaintingStyle[];
  types: PaintingType[];
  color: string;
}

class SearchForm extends FormEntity<PaintingSearch> {
  constructor(search: Partial<PaintingSearch> = {}) {
    super({
      size: new FormControl(search.size),
      styles: new FormControl(search.styles ?? []),
      types: new FormControl(search.types ?? []),
      color: new FormControl(search.color),
    }, { updateOn: 'blur' })
  }
}

function includesField<T, K extends keyof T>(value: T, field: K, search?: T[K][]) {
  if (!search?.length) return true;
  return search.includes(value[field]);
}

function filterPaintings(paintings: Painting[], search: Partial<PaintingSearch> = {}) {
  return paintings.filter(painting => {
    if (!includesField(painting, 'size', search.size)) return false;
    if (!includesField(painting, 'style', search.styles)) return false;
    if (!includesField(painting, 'type', search.types)) return false;
    return true;
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
  paintings$ = combineLatest([
    this.service.valueChanges(),
    this.form.value$
  ]).pipe(
    map(([paintings, search]) => filterPaintings(paintings, search))
  );

  readonly sizes = paintingSizes;
  readonly styles = paintingStyles;
  readonly types = paintingTypes;
  

  trackById = trackById;
  
  constructor(private service: PaintingService) { }

}
