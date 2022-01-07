import { FormControl } from "@angular/forms";
import { Rent, Duration } from "@locart/model";
import { FormEntity } from "@locart/utils";
import { DateFilterFn } from '@angular/material/datepicker';
import { addWeeks } from "date-fns";

export class DurationForm extends FormEntity<Duration> {
  constructor() {
    super({
      from: new FormControl(),
      to: new FormControl(),
    })
  }
}

export const filterDates = (rents: Rent[]): DateFilterFn<Date> => (date: Date | null) => {
  if (!date) return false;
  if (date < addWeeks(new Date(), 1)) return false;
  return rents.every(({ duration }) => date < duration.from || date > duration.to);
};

export function notInRent(rent: Rent, duration: Duration) {
  return duration.from < rent.duration.to || duration.to > rent.duration.from;
}