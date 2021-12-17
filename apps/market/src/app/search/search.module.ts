import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    PageModule.forChild(SearchComponent, [{
      path: 'painting',
      loadChildren: () => import('./painting/list/list.module').then(m => m.PaintingListModule)
    }, {
      path: 'painting/:paintingId',
      loadChildren: () => import('./painting/view/view.module').then(m => m.PaintingViewModule)
    }]),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'search'
  }]
})
export class SearchModule { }
