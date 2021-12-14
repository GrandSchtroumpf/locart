import { AbstractControl, AbstractControlOptions, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { defer, Observable, startWith } from "rxjs";

type CreateControl<T> = (value: Partial<T>) => AbstractControl;
type ControlOptions = ValidatorFn | ValidatorFn[] | AbstractControlOptions;

export class FormEntity<T> extends FormGroup {
  value!: T;
  valueChanges!: Observable<T>;
  value$ = defer(() => this.valueChanges.pipe(startWith(this.value)));

  reset(value: Partial<T> = {}): void {
    // Rebuild the FormArray
    for (const [key, control] of Object.entries(this.controls)) {
      if (control instanceof FormList) continue;
      if (control instanceof FormArray) {
        control.clear();
        const content = value[key as keyof T];
        if (Array.isArray(content)) content.forEach(() => control.push(new FormControl()))
      }
    }
    super.reset(value);
  }
}

export class FormList<T> extends FormArray {
  value!: T[];
  valueChanges!: Observable<T[]>;
  value$: Observable<T[]>;
  creatContol: CreateControl<T>;

  constructor(
    value: Partial<T>[] = [],
    createControl: CreateControl<T> = (v) => new FormControl(v),
    validators?: ControlOptions
  ) {
    const controls = value.map(createControl);
    super(controls, validators);
    this.creatContol = createControl;
    this.value$ = defer(() => this.valueChanges.pipe(startWith(this.value)));
  }

  add(value: Partial<T> = {}) {
    const control = this.creatContol(value);
    this.push(control);
  }

  reset(value: Partial<T>[] = []) {
    this.clear();
    value.forEach(() => this.add());
    super.reset(value);
  }
}