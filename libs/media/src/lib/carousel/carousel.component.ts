import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Pipe, PipeTransform, AfterViewInit } from '@angular/core';
import { Image } from '@locart/model';
import { BreakpointService, fade } from '@locart/utils';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

function pathToId(path: string) {
  const regex = /([^\w\s])/g;
  return 'path_' + path.replace(regex, '');
}
@Pipe({ name: 'pathToId' })
export class PathToIdPipe implements PipeTransform {
  transform(path: string) {
    return pathToId(path);
  }
}

@Component({
  selector: 'la-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
    animations: [fade],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('slides') slides!: ElementRef<HTMLUListElement>;
  @Input() imgs: Image[] = [];
  index$?: Observable<number>;
  

  constructor(private breakpoint: BreakpointService){}

  get maxIndex() {
    return this.imgs.length - this.rowSize;
  }

  get rowSize() {
    if (this.breakpoint.matches('mobile')) return 1;
    if (this.breakpoint.matches('desktop')) return 4;
    return 3;
  }

  ngAfterViewInit() {
    if (!this.slides) return;
    const el = this.slides.nativeElement;
    this.index$ = fromEvent(el, 'scroll').pipe(
      map(() => {
        const scroll = (el.scrollLeft + 8) / el.scrollWidth;
        return Math.floor(scroll * (this.imgs.length));
      }),
      distinctUntilChanged(),
      startWith(0)
    )
  }

  private move(index: number, direction: -1 | 1) {
    const nextIndex = direction === -1
      ? Math.max(index - this.rowSize, 0)
      : Math.min(index + this.rowSize, this.maxIndex);
    const path = this.imgs[nextIndex]?.path;
    if (!path) return;
    const id = pathToId(path);
    const slidesEl = this.slides.nativeElement; // Get the underlying HTML ul element
    const slide = slidesEl.querySelector(`#${id}`);
    if (!slide) return;
    const delta = slidesEl.scrollLeft + slide.getBoundingClientRect().x - slidesEl.getBoundingClientRect().x; // delta to move the scroll to
    slidesEl.scrollTo({left: delta , behavior: 'smooth'}); // Scroll the sliders into the targeted image
  }

  previous(index: number) {
    if (index === 0) return;
    this.move(index, -1);
  }

  next(index: number) {
    if (index === this.maxIndex) return;
    this.move(index, 1);
  }

}