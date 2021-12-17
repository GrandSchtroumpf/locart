import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { exist } from '@locart/utils';
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
  tags: (string | number)[] = [];
  @Input() value!: T;
  @Input() keys: (keyof T)[] = [];
  @Input() scope = ''

  ngOnInit(): void {
    this.tags = this.keys.map(key => this.value[key] as any).filter(exist);
  }

  get read() {
    if (!this.scope) return 'static';
    return `static.${this.scope}`;
  }
}
