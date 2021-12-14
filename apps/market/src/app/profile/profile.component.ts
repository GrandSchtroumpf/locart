import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@locart/auth';
import { Profile } from '@locart/model';
import { firstValueFrom } from 'rxjs';

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

  constructor(private auth: AuthService) { }

  async ngOnInit() {
    this.current = await firstValueFrom(this.auth.profile$);
    this.form.reset();
  }

  reset() {
    this.form.reset(this.current);
  }

  async becomeSeller() {
    if (!this.current || this.current.isSeller) return;
    await this.auth.update({ isSeller: true });
    this.current.isSeller = true;
  }
}
