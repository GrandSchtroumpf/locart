import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'static-tags',
  templateUrl: './static-tags.component.html',
  styleUrls: ['./static-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'static'
  }]
})
export class StaticTagsComponent<T> implements OnInit {
  tags: Partial<Record<keyof T, string | number>> = {};
  @Input() value!: T;
  @Input() keys: (keyof T)[] = [];
  @Input() scope = ''

  ngOnInit(): void {
    const fields: Partial<Record<keyof T, string | number>> = {};
    for (const key of this.keys) {
      const value = this.value[key];
      if (typeof value === 'string') fields[key] = value;
      if (typeof value === 'number') fields[key] = value;
    }
    this.tags = fields;
  }

  get read() {
    if (!this.scope) return 'static';
    return `static.${this.scope}`;
  }
}
