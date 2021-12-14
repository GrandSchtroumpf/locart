import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { ConfirmExitComponent } from './confirm.component';

@NgModule({
  declarations: [ConfirmExitComponent],
  exports: [ConfirmExitComponent, MatDialogModule],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslocoModule, MatIconModule],
})
export class ConfirmExitModule {}
