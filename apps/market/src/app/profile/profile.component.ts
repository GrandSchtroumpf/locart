import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@locart/auth';
import { MediaService } from '@locart/media/upload';
import { Profile } from '@locart/model';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'la-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  current?: Profile;
  form = new FormGroup({
    name: new FormControl(),
    tel: new FormControl(),
    avatar: new FormControl(),
  });

  @ViewChild('success') success!: TemplateRef<unknown>;

  constructor(
    private auth: AuthService,
    private mediaService: MediaService,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.current = await firstValueFrom(this.auth.profile$);
    this.form.reset(this.current);
  }

  reset() {
    this.form.reset(this.current);
  }

  async save() {
    if (this.form.invalid) return this.form.markAsTouched();
    await this.mediaService.upload();
    await this.auth.update(this.form.value);
    this.form.markAsPristine();
    this.snackbar.openFromTemplate(this.success, { duration: 3000 });
  }
  
  async becomeSeller() {
    if (!this.current || this.current.isSeller) return;
    await this.auth.update({ isSeller: true });
    this.current.isSeller = true;
    this.cdr.markForCheck();
  }
}
