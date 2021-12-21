import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@locart/auth';
import { Profile } from '@locart/model';

@Component({
  selector: 'la-profile-type',
  templateUrl: './profile-type.component.html',
  styleUrls: ['./profile-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionComponent {

  constructor(private auth: AuthService, private router: Router) {}

  async select(type: Profile['type']) {
    await this.auth.update({ type });
    const route = type === 'seller' ? '/workshop' : '/search';
    this.router.navigate([route]);
  }
}
