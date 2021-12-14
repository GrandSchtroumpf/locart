import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { trackByIndex, bool } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'static-select',
  templateUrl: './static-select.component.html',
  styleUrls: ['./static-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'static'
  }]
})
export class StaticSelectComponent implements OnInit {
  control?: FormControl;

  @Input() static: (string | number)[] = [];
  @Input() scope = '';
  @Input() @bool multiple!: string;
  @Input() name!: string;

  trackByIndex = trackByIndex;

  constructor(public parent: FormGroupDirective) {}

  get read() {
    if (!this.scope) return 'static';
    return `static.${this.scope}`;
  }

  ngOnInit() {
    const controls = this.parent.form?.controls;
    if (!controls) throw new Error('Could not find FormGroupDirective parent for static-select');
    if (!this.name) throw new Error('You should provide a name to static-select with scope ' + this.scope);
    if (!controls[this.name]) throw new Error(`"${this.name}" is not part of FormGroup.`);
    this.control = controls[this.name] as FormControl
  }
}
