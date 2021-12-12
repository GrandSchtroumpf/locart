import { Pipe, PipeTransform } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Pipe({ name: 'pupilPostion', pure: false })
export class PupilPositionPipe implements PipeTransform {
  transform(input: MatInput, max: number = 6): number {
    if (input.focused) {
      return Math.min(input.value.length / 3 - max, max);
    } else {
      return 1;
    }
  }
}
