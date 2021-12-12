import { NgModule } from '@angular/core';
import { SearchComponent } from './search.component';
import { PageModule } from '@locart/utils';



@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    PageModule.forChild(SearchComponent)
  ]
})
export class SearchModule { }
