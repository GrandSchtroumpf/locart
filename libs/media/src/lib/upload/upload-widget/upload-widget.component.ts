import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { UploadTask } from 'firebase/storage';
import { slideUp } from '@locart/utils';
import { UploadState } from '@locart/model';
import { percentage } from '../../utils';

@Component({
  selector: 'upload-widget',
  templateUrl: './upload-widget.component.html',
  styleUrls: ['./upload-widget.component.scss'],
  animations: [slideUp],
  host: {
    class: 'mat-menu-panel'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadWidgetComponent {
  @HostBinding('@slideUp') animation = true;
  trackByIndex = trackByIndex;
  constructor(@Inject('tasks') public tasks: UploadTask[]) {}

  hasState(task: UploadTask, states: UploadState[]) {
    return states.includes(task.snapshot.state as UploadState);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { trackByIndex } from '@locart/utils';

@Pipe({ name: 'progress' })
export class TaskProgressPipe implements PipeTransform {
  transform(task: UploadTask): Observable<number> {
    return percentage(task).pipe(
      map((value) => value?.progress || 0),
      catchError(() => of(0))
    );
  }
}

@Pipe({ name: 'hasState' })
export class TaskHasStatePipe implements PipeTransform {
  transform(task: UploadTask, states: UploadState | UploadState[]): boolean {
    const state = task.snapshot.state as UploadState;
    return Array.isArray(states) ? states.includes(state) : state === states;
  }
}
