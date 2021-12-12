import {
  TRANSLOCO_LOADER,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule,
} from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

import { Injectable, NgModule, Optional } from '@angular/core';
import { StateTransferService } from '@locart/utils';
import env from '@env';

@Injectable({ providedIn: 'root' })
export class TranslocoImportLoader implements TranslocoLoader {
  constructor(@Optional() private stateTransfer: StateTransferService) {}

  async getTranslation(lang: string) {
    // Prevent network call to root file
    if (lang === 'fr' || lang === 'en') return Promise.resolve({});
    const fromServer = this.stateTransfer?.get(lang);
    if (fromServer) return fromServer;
    const data = await import(`../assets/i18n/${lang}.json`);
    this.stateTransfer?.set(lang, data.default);
    return data.default;
  }
}

const formatting = {
  currency: {
    minimumFractionDigits: 0,
  },
  decimal: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
};



@NgModule({
  imports: [
    TranslocoLocaleModule.forRoot({
      defaultLocale: 'fr-FR',
      localeConfig: {
        global: formatting,
      },
      langToLocaleMapping: {
        fr: 'fr-FR',
      },
    }),
  ],
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['fr', 'en'],
        defaultLang: 'fr',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: env.production,
        flatten: {
          aot: env.production,
        },
      }),
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoImportLoader },
  ],
})
export class TranslocoRootModule {}
