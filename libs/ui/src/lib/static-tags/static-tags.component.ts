import { Component, ChangeDetectionStrategy, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'static-tag-list',
  template: '<ng-content></ng-content>',
  styleUrls: ['./static-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class StaticTagListComonent {

}

@Component({
  selector: 'static-tag',
  template: `<ng-container *transloco="let t; read: 'static'">{{ t(path) }}</ng-container>`,
  // styles: ['./static-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'static'
  }]
})
export class StaticTagComponent {
  @Input() value!: string | number;
  @Input() key!: string;
  @Input() scope = '';

  get path() {
    return `${this.scope}.${this.key}.${this.value}`
  }
}

