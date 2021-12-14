import { CommonModule } from '@angular/common';
import { Route } from '@angular/compiler/src/core';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { RouterModule, provideRoutes } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { QuicklinkModule } from 'ngx-quicklink';
import { SeoModule } from './seo';


const PAGE_DEPS = [CommonModule, RouterModule, TranslocoModule, QuicklinkModule, SeoModule];

@NgModule({
  imports: PAGE_DEPS,
  exports: PAGE_DEPS,
})
export class PageModule {
  static forChild(component: Type<unknown>, children?: Route[]): ModuleWithProviders<PageModule> {
    const providers = children
      ? [provideRoutes([{ path: '', component, children }])]
      : [provideRoutes([{ path: '', component }])];
    return {
      ngModule: PageModule,
      providers,
    };
  }
}
