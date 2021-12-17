import { FormControl } from "@angular/forms";
import { Rent, Duration } from "@locart/model";
import { FormEntity } from "@locart/utils";
import { DateFilterFn } from '@angular/material/datepicker';

export class DurationForm extends FormEntity<Duration> {
  constructor() {
    super({
      from: new FormControl(),
      to: new FormControl(),
    }, { updateOn: 'blur' })
  }
}

export const filterDates = (rents: Rent[]): DateFilterFn<Date> => (date: Date | null) => {
  if (!date) return false;
  if (date < new Date()) return false;
  return rents.every(({duration}) => date < duration.from || date > duration.to);
};