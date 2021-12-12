import { Input, Directive, NgModule, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import env from '@env';

type OpenGraphProperty = 'title' | 'description' | 'image' | 'url';
type TwitterName = 'title' | 'description' | 'image' | 'card';


@Injectable({ providedIn: 'root' })
export class Seo {
  set title(value: string) {
    const title = value ? `Locart - ${value}` : 'Locart';
    this.titleService.setTitle(title);
    this.setOpenGraph('title', title);
    this.setTwitter('title', title);
  }

  set description(description: string | null | undefined) {
    if (!description) return;
    this.metaService.updateTag({ content: description }, "name='description'");
    this.setOpenGraph('description', description);
    this.setTwitter('description', description);
  }

  set image(image: string | null | undefined) {
    if (!image) return;
    const url = image.startsWith('https://') ? image : `${env.baseUrl}/assets/img/${image}`;
    this.setOpenGraph('image', url);
    this.setTwitter('image', url);
  }
  
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private transloco: TranslocoService
  ) {
    // Only index production version
    if (!env.production) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    }
  }

  setPage(scope: string) {
    this.title = this.transloco.translate(`${scope}.seo.title`);
    this.description = this.transloco.translate(`${scope}.seo.description`);
  }
    
  // TODO: Implements that: https://github.com/joshbuchea/HEAD#social

  setOpenGraph(property: OpenGraphProperty, content: string) {
    this.metaService.updateTag({ content }, `property='og:${property}'`);
  }
  
  setTwitter(name: TwitterName, content: string) {
    this.metaService.updateTag({ content }, `name='twitter:${name}'`);
  }
}

@Directive({ selector: 'seo-meta, [seoMeta]' })
export class SeoMetaDirective {
  
  @Input() set title(value: string) {
    const title = value ? `Locart - ${value}` : 'Locart';
    this.titleService.setTitle(title);
    this.setOpenGraph('title', title);
    this.setTwitter('title', title);
  }

  @Input() set description(description: string | null | undefined) {
    if (!description) return;
    this.metaService.updateTag({ content: description }, "name='description'");
    this.setOpenGraph('description', description);
    this.setTwitter('description', description);
  }

  @Input() set image(image: string | null | undefined) {
    if (!image) return;
    const url = image.startsWith('https://') ? image : `${env.baseUrl}/assets/img/${image}`;
    this.setOpenGraph('image', url);
    this.setTwitter('image', url);
  }
  
  constructor(
    private titleService: Title,
    private metaService: Meta,
  ) {
    // Only index production version
    if (!env.production) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    }
  }
    
  // TODO: Implements that: https://github.com/joshbuchea/HEAD#social

  setOpenGraph(property: OpenGraphProperty, content: string) {
    this.metaService.updateTag({ content }, `property='og:${property}'`);
  }
  
  setTwitter(name: TwitterName, content: string) {
    this.metaService.updateTag({ content }, `name='twitter:${name}'`);
  }
}

@NgModule({
  imports: [],
  declarations: [SeoMetaDirective],
  exports: [SeoMetaDirective],
})
export class SeoModule {}